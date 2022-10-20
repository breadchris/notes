
In h1-702 2018, I finally got around to writing some Android pwnable challenges which I had been meaning to do for a while. There have not been many mobile CTF problems in the past (a nice list of which can be checked out [here](https://github.com/xtiankisutsa/awesome-mobile-CTF)) even though mobile security has been growing in popularity. Fresh with ideas, I found myself making quite a few mobile CTF problems over the past few [ctfs I helped make](/ctf/hackerone/2018/06/10/making-h1-ctfs/), but they all ended up being reverse engineering problems. While the problems ended up turning out decently, I wanted to pursue a category of mobile application CTF challenges which was very rarely seen.

Local mobile exploitation (needing to have someone install an application) is an interesting field of cyber security as it is typically seen to have relatively low impact. However, it is hard to discount the value of this field, when someone's device has on average [$14,000 worth of information](https://www.ponemon.org/blog/how-much-is-the-data-on-your-mobile-device-worth) (I am skeptical of this number, but anything in that ballpark is still a lot of hekin money). There is a decent amount of research in this field, however it is primarily based around the mobile malware business since it is the easiest way to get on someone's device. It is pretty easy to find signs of malware within an APK, but it is much harder to find signs of foul play when your app is just exploiting [deserialization vulnerabilities](https://lgtm.com/blog/android_deserialization) as you are sending seemingly random data to another application. 

The more rare vulnerabilities are the mobile RCE exploits. The best example of the potential impact of these vulnerabilites can be found with the [Webview.addJavascriptInterface](https://labs.mwrinfosecurity.com/blog/webview-addjavascriptinterface-remote-code-execution/) vulnerability. There has been a lot of horizontal growth in this field where [everyone](https://github.com/linkedin/qark) [and](https://labs.mwrinfosecurity.com/tools/drozer/) [their](https://github.com/MobSF/Mobile-Security-Framework-MobSF) [mother](https://github.com/AndroBugs/AndroBugs_Framework) [has](https://github.com/spotbugs/spotbugs) [made](https://github.com/Sable/soot) [an](https://github.com/facebook/infer) [apk](https://github.com/sonyxperiadev/ApkAnalyser) [vulnerability](https://github.com/honeynet/apkinspector) [scanner](https://github.com/honeynet/apkinspector). Let me be clear, this is not at all a bad thing. There are some tools that are more complete, extensive, well maintained than others, but this is a clear example of interest in this field with very little groundbreaking research. You can take this as there not being bugs to find, or you can take it as them not being found yet ;)

When I saw Google CTF had put together mobile CTF challenges you could [exploit remotely](https://github.com/ctfs/write-ups-2016/tree/master/google-ctf-2016/mobile) on their servers, I thought it was the coolest shit. There needed to be a way to bring the realm of mobile exploitation into CTF challenges. This was the excitement that people needed to start looking at this field.

## 👷 Why Android pwnables are hard to run

Most pwnable problems that you see in CTFs are individual binaries that can run by themselves in a Dockerfile with a super small memory footprint. This is especially important when you are dealing with many requests and all your process needs to do is fork itself. To let people exploit APKs, we need to run them seperately, spinning up an emulator each time to make sure people do not do anything funny to other people's submissions.

It is important to note here, all APKs can be read by any other APK installed on the device with the `android.permission.READ_EXTERNAL_STORAGE` permission via [publicSourceDir](https://developer.android.com/reference/android/content/pm/ApplicationInfo.html#publicSourceDir). You cannot change the permissions on this directory as the dexloader is going to yell at you. 

So for getting all of these emulators, we need a VM with the entire Android SDK and the system-image for what Android API version we want for the emulator.

system-image's are quite big:

{% highlight raw lineanchors %}
➜  android-28 du -h .
6.6G	./default/x86
3.1G	./default/x86_64
9.8G	./default
4.0K	./google_apis_playstore/x86/data/misc/wifi
4.0K	./google_apis_playstore/x86/data/misc
4.0K	./google_apis_playstore/x86/data
6.6G	./google_apis_playstore/x86
6.6G	./google_apis_playstore
16G	.
{% endhighlight %}

But fortunately, we only need to download this once (if we only have challenges for one API level). For each emulator we will still need a decent amount of space:

{% highlight raw lineanchors %}
➜  android_P_x86_64.avd du -h .
565M	.
{% endhighlight %}

## 🔢 How many emulators will (more like can) we run

This is a question that comes to one thing: optimization. Since Android emulators run in [qemu](https://www.qemu.org/), we are going to be taking a big hit on performance right off the bat. Lucky for us, emulators have [KVM support](https://developer.android.com/studio/run/emulator-acceleration). If we want to take advantage of this enhancement, we will need to host our challenges from something that supports KVM. For h1-702, I used [digital ocean](https://www.digitalocean.com/). EC2 did not have this support however, so be careful about where you are looking to host your problems. 

When the emulators are running, they take up quite a bit of memory and CPU:

{% highlight raw lineanchors %}
PID	Name		  CPU %  Time	   	  		RAM
57998   qemu-system-x86_  214.6  00:19.46  50/2   2     319+    825M+   7264K   0B      57998  50258  running   *0[5]
{% endhighlight %}

Now, ideally we do not really need a lot of the stuff the emulator has. Most noteable being the screen. Checking out the [Android emulator docs](https://developer.android.com/studio/run/emulator-commandline) we can see a bunch of options that are useful for us:

* `-no-snapshot`: We save some time (and disk space) while making sure that each time we run the emulator it is a blank slate
* `-no-boot-anim`: Saves time
* `-accel mode`: Accelerate execution
* `-no-window`: Do not do graphics stuff (memory and time)

The big "doh!" here was when I was solving a challenge and was wondering why nothing was happening when I enabled `-no-window`, but I could solve the challenge (without human interaction) without this option. The challenge I had written rendered graphical objects on the screen and there was no longer any screen to draw them to... so Android just gave up on running the app? I ended up having to leave the `-no-window` option out and running the emulator in a [fake X server](http://elementalselenium.com/tips/38-headless). Sad.

At this point, I just had an unreliable submission server with a pretty slow emulator. Given that there were hundreds of people play in this CTF, I could not have this go live so I just ended up having people send me their APKs and I ran them by hand. A very unfortunate solution, but at least I had my own personal submission server!

## 😤 How do I prevent people from yelling at me every second about their "exploit working locally, but not remotely"

The easiest way to prevent this is give them the exact setup that you are using on your server, down to the ways that you are invoking their APK. It is imporant to be explicit and verbose about this. I ran into problems when I made a challenge that required people to call the JVM garbage collector and did not realize how unpredictable triggering the GC was. It ended up being a huge nusance :(

## 💻 Why did you make your own thing for this?

In hind sight, I should have just gone with [android-farm](https://medium.com/@Malinskiy/android-ci-with-kubernetes-684713a83eec), but on first glance it seemed unnesesarily complicated for my use case (I just had to run emulators right?). It seems the authors of this tool ran into the same exact problems I did with adb:

{% highlight raw lineanchors %}

* reconnecting to devices on the go (i.e. in the middle of the run)
* rerunning the test on a different device if a failure happens and the device is out
* visualizing the associations between the tests and the devices to identify potentially faulty devices
* balancing the execution time of tests

{% endhighlight %}

Setting this up seems like quite the job, maybe a topic for a future blog post...

I still see a niche for the submission server I had written for this CTF, and I will still work on developing it further. This would have been more successful had I had been smart and wrote challenges that did not depend on graphics being rendered.

## 📱 Can we emulate other devices for even cooler CTF problems?

It seems like there is quite a bit of work to make this work at scale, but ideally we should be able to emulate pretty much anything with qemu, even [macos](https://github.com/kholia/OSX-KVM). There is for sure some interesting avenues to pursue here and probably something I will explore for future CTFs.

An example of cool stuff people are doing with hardware is the [Riscure Embedded Hardware Challenge](https://www.youtube.com/watch?v=u_U6F2Kkbb0) which gave contestants an arduino with CAN bus firmware. I hope to see more of this stuff in the future since hardware security (IoT, cars,  routers, etc.) has become the talk of the town.

## 🏎️ Where the code be?

You can check out the shitty APK submission server I put together [here](https://github.com/breadchris/apk-submission-queue). If you feel inclined to work on making this better, I will for sure work with you on your PRs.
