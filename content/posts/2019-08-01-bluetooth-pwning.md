---
layout:     post
title:      A Study in Blue
date:       2019-08-01 00:00:00
summary:    Reported Android CVEs which affected the bluetooth stack and how they relate to other stacks.
categories: pwn exploit bluetooth
---

Note: I am a lazy fuck and I have been putting off this post for a while so I just dumped some stuff in my text editor and put it up. I plan to refine this periodically over time. I will leave notes here while I update it. If this stuff is useful to you and you are running into problems setting stuff up or whatever, PM me on twitter.

I started digging into bluetooth stacks after Armis announced its series of vulnerabilities affecting Linux, Android, iOS, and Windows, which they named [Bluebourne](https://www.armis.com/blueborne/). This paper [explaining the vulnerabilities](https://go.armis.com/hubfs/BlueBorne%20Technical%20White%20Paper-1.pdf) as well as the follow up [explaining the exploitation](https://go.armis.com/hubfs/BlueBorne%20-%20Android%20Exploit%20(20171130).pdf) were very well written and I highly recommend you take a look at them. If you want to run their POC, you can check it out [here](https://github.com/ArmisSecurity/blueborne), and if you want to adopt this POC to your device, take a look at [this](https://jesux.es/exploiting/blueborne-android-6.0.1-english/).

Trying to make sense of these disclosed vulnerabilities, along with their POCs, I tried to find some online resources to help me out. There were a lot of interesting projects dealing with the application layer of bluetooth and how applications which use this technology expose themselves to potential issues. But, there was very little in the way of analyzing the actual bluetooth stack which enables these higher level applications.

TODO: resources that I found.

I initially wanted to be able to speak the protocol in hopes I could write a fuzzer or something to shake some bugs out of bluetooth stack code. Bluekitchen's bluetooth documentation and implementation helped immensely as I had a means of sending data to a target device.

I searched for vulnerabilities in Android for a while with no luck. But over the period of time in this research I learned a great deal about Bluetooth and watched as seasoned bug finding veterans crushed this source code.

The initial post I want to make will just outline different components of Bluetooth and how they relate to each other. Additionally, I want to point out the attack surface of these components and vulnerabilities in these components within their implementation (mostly Android).

I will be following this post up with some helpful instructions for running and debugging Bluetooth POCs to help with your own bug hunting.

# Bluetooth enabled things
A bunch of things use bluetooth, here are some stack implementations I am aware of:
* MacOS Stack - written in objc
* iOS Stack - written in c
* Android (fluoride)
* BTStack
* mynewt
* nimble - zephyr
* Windows
* Toshiba
* Linux (bluez)
* Car entertainment systems

# HCI

## Notable features
* Interfaces with the bluetooth controller - For example, whenever a packet is sent, the controller will tell the stack how many packets were sent via HCI (TODO image)
* [Scapy](https://sourcegraph.com/github.com/secdev/scapy/-/blob/scapy/layers/bluetooth.py#L155)
* The difference between BR/EDR and LE
* [GAP for LE](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/gap)
* A common naming convention for packet buffers is `pdu` ([protocol data unit](https://en.wikipedia.org/wiki/Protocol_data_unit))
* For l2cap, HCI creates `handles` which it passes up after a successful connection
* Link Manager Protocol (LMP) is also worth mentioning here as it "The Link Manager carries out link setup, authentication, link configuration and other protocols. It discovers other remote LM’s and communicates with them via the Link Manager Protocol (LMP)." ([info](https://www.amd.e-technik.uni-rostock.de/ma/gol/lectures/wirlec/bluetooth_info/lmp.html))
* [GAP](https://bluekitchen-gmbh.com/btstack/profiles/#gap-generic-access-profile-classic)
* [GAP LE](https://bluekitchen-gmbh.com/btstack/profiles/#gap-le-generic-access-profile-for-low-energy)

## Attack Surface
* Not a whole lot going on since this layer is just in charge of talking to a controller and passing data along to higher levels
* ECC attack for MiTM (TODO: Link)
* What is interesting about the attack surface is that for each protocol, Android has a server and a client. For example, the Android phone can receive and parse SDP packets, as well as send them to a device it is in the process of connecting to. While we would typically need to find some triggering condition to have the client issue requests from us and parse their response, this is an interesting attack surface as it might be less likely developers will think about the security of parsing the response from the server. As we will see in the various protocol client applications, this was indeed the case.

## Stack Implementations
[Scapy](https://sourcegraph.com/github.com/secdev/scapy/-/blob/scapy/layers/bluetooth.py#L155)
Scapy gives a nice overview of how packets are structured, but because of the weirdness of the bluetooth protocol, this information only gets you so far.

If you want to dig into the details of Bluetooth, I recommend looking through Bluekitchen's btstack. Here is BTStack's main hci [event handler](https://github.com/bluekitchen/btstack/blob/d966a453850a16585ca5c468190532d5cbf0d844/src/hci.c#L1856).

HCI is not entirely interesting, it is mainly used for configuring the Bluetooth controller, creating/configuring connections and sending/receiving data to devices (power on, off, start advertising le data, create connection). (TODO: Link to btstack hci_cmd.c)

More information on HCI can be found [here](https://bluekitchen-gmbh.com/btstack/protocols/#hci-host-controller-interface)

## CVEs
I don't know if there are any?

# L2CAP

## Notable features
* Basically the TCP of Bluetooth
    - Packet retransmission/reassembly - potentially sketchy code (TODO link to different implementations)
    - Both client and server send each other their `mtu`s (max transmission unit) to specify how much data they can send (one of the vulnerabilities in the BlueBourne research used this to trigger a vuln TODO: link)
* Static vs. Dynamic channels
    - There are some pre-defined ranges by the bluetooth standard
    - The channels are different for br/edr and le connections
    - A protocol is identified by a `psm` (e.g. SDP has psm 1, ATT has psm 7, a really good list can be found in bluez's sdptool sdptool.c:259, when we get to SDP we will look at this more)
    - After connecting to a protocol, the are given a `cid` (channel id) which lets you send acl (data) packets to
* Signalling Channel
    - The entrypoint for creating and configuring channels with a remote device (btstack l2cap_signalling.c:53)
* classic (br/edr) and low-energy (le) exist in l2cap, their code paths somewhat merge
    - This can be seen in btstack/src/l2cap.c:3443

## Attack Surface
* Channels and their state are created and stored within the stack, abusing the state machine could lead to use-after-frees

TODO: Go through each bluetooth stack and show what channels are registered (point out the weird iOS stuff)

## Stack Comparisions

## CVEs
* CVE-2017-0781 RCE (Allocate buffers of the right size when BT_HDR is included) [diff](https://android.googlesource.com/platform/system/bt/+/c513a8ff5cfdcc62cc14da354beb1dd22e56be0e)
  - Vuln used by Bluebourne in their exploit POC, the code when run would cause a heap overflow due to the allocation being too small
  {% highlight c lineanchors %}
  p_bcb->p_pending_data = (BT_HDR*)osi_malloc(rem_len + sizeof(BT_HDR));
  memcpy((uint8_t*)(p_bcb->p_pending_data + 1), p, rem_len);
  {% endhighlight %}
* CVE-2018-9359 Fix OOB read in process_l2cap_cmd (signalling commands ID) [diff](https://android.googlesource.com/platform/system/bt/+/b66fc16410ff96e9119f8eb282e67960e79075c8)
  - Pretty much no signalling commands were checking minimum length and variables read from the packet were sent back to the user
  - Check out the [Quarkslab writeup](https://blog.quarkslab.com/a-story-about-three-bluetooth-vulnerabilities-in-android.html)
* CVE-2018-9419	l2c ble ID [diff](https://android.googlesource.com/platform/system/bt/+/f1c2c86080bcd7b3142ff821441696fc99c2bc9a)
  - End of packet is not checked, bytes can be leaked
  - Check out the [Quarkslab writeup](https://blog.quarkslab.com/a-story-about-three-bluetooth-vulnerabilities-in-android.html)
{% highlight c lineanchors %}
     case L2CAP_CMD_DISC_REQ:
+      if (p + 4 > p_pkt_end) {
+        android_errorWriteLog(0x534e4554, "74121659");
+        return;
+      }
{% endhighlight %}
* CVE-2018-9555	l2cap RCE [diff](https://android.googlesource.com/platform/system/bt/+/02fc52878d8dba16b860fbdf415b6e4425922b2c)
  - This code is difficult to hit as you need to have an LE data channel listening for connections (most LE connections interact with GATT)
{% highlight c lineanchors %}
+    if (sdu_length < p_buf->len) {
+      L2CAP_TRACE_ERROR("%s: Invalid sdu_length: %d", __func__, sdu_length);
+      android_errorWriteWithInfoLog(0x534e4554, "112321180", -1, NULL, 0);
+      /* Discard the buffer */
+      osi_free(p_buf);
+      return;
+    }
{% endhighlight %}
* ble l2cap retransmission RCE (regression of CVE-2018-9555) [diff](https://android.googlesource.com/platform/system/bt/+/488aa8befd5bdffed6cfca7a399d2266ffd201fb)
{% highlight c lineanchors %}
void l2c_lcc_proc_pdu(tL2C_CCB* p_ccb, BT_HDR* p_buf) {
  uint8_t* p = (uint8_t*)(p_buf + 1) + p_buf->offset;
  uint16_t sdu_length;
  /* Buffer length should not exceed local mps */
  if (p_buf->len > p_ccb->local_conn_cfg.mps) {
    /* Discard the buffer */
  }
  if (p_ccb->is_first_seg) {
    // If we do not have this check, then p_buf->len can be 0 or 1
    if (p_buf->len < sizeof(sdu_length)) {
      /* Discard the buffer */
    }

    STREAM_TO_UINT16(sdu_length, p);
    /* Check the SDU Length with local MTU size */
    if (sdu_length > p_ccb->local_conn_cfg.mtu) {
      /* Discard the buffer */
    }
    if (sdu_length < p_buf->len) {
      /* Discard the buffer */
    }
    p_data = (BT_HDR*)osi_malloc(BT_HDR_SIZE + sdu_length);

    p_buf->len -= sizeof(sdu_length);
  }

  // p_buf->len could be super huge
  memcpy((uint8_t*)(p_data + 1) + p_data->offset + p_data->len,
         (uint8_t*)(p_buf + 1) + p_buf->offset, p_buf->len);
{% endhighlight %}
* CVE-2018-9485	L2ble OOB read [diff](https://android.googlesource.com/platform/system/bt/+/bdbabb2ca4ebb4dc5971d3d42cb12f8048e23a23)
  * End of packet is never checked for an le l2cap configuration request
{% highlight c lineanchors %}
   p_pkt_end = p + pkt_len;

+  if (p + 4 > p_pkt_end) {
+    android_errorWriteLog(0x534e4554, "80261585");
+    LOG(ERROR) << "invalid read";
+    return;
+  }
+
   STREAM_TO_UINT8(cmd_code, p);
   STREAM_TO_UINT8(id, p);
   STREAM_TO_UINT16(cmd_len, p);
{% endhighlight %}
* CVE-2018-9486 l2cap check length [diff](https://android.googlesource.com/platform/system/bt/+/bc6aef4f29387d07e0c638c9db810c6c1193f75b)
{% highlight c lineanchors %}
static void hidh_l2cif_data_ind(uint16_t l2cap_cid, BT_HDR* p_msg) {
...
+  if (p_msg->len < 1) {
+    HIDH_TRACE_WARNING("Rcvd L2CAP data, invalid length %d, should be >= 1",
+                       p_msg->len);
+    osi_free(p_msg);
+    android_errorWriteLog(0x534e4554, "80493272");
+    return;
+  }
+
   ttype = HID_GET_TRANS_FROM_HDR(*p_data); // p_data has data from the server that will get leaked
   param = HID_GET_PARAM_FROM_HDR(*p_data);
   rep_type = param & HID_PAR_REP_TYPE_MASK;
{% endhighlight %}
* CVE-2018-9484 Out of Bounds read in l2cap [diff](https://android.googlesource.com/platform/system/bt/+/d5b44f6522c3294d6f5fd71bc6670f625f716460)
  - you can position p and get data out
{% highlight c lineanchors %}
if ((cfg_len + L2CAP_CFG_OPTION_OVERHEAD) <= cmd_len) {
+ if (p + cfg_len > p_next_cmd) return;
{% endhighlight %}

* [Hell2cap](https://www.cymotive.com/wp-content/uploads/2019/03/Hell2CAP-0day.pdf) (stupid named vulns :P)
* [Tesla Keen Team report](https://www.blackhat.com/docs/us-17/thursday/us-17-Nie-Free-Fall-Hacking-Tesla-From-Wireless-To-CAN-Bus-wp.pdf)

## Interactive Example
Let's run through an example POC

// TODO

# SM and SMP

## SMP - Notable Features
- Capabilities and security levels
Security Levels:
[btstack](https://sourcegraph.com/github.com/bluekitchen/btstack@develop/-/blob/src/l2cap.c#L2232:64)
[fluoride](https://android.googlesource.com/platform/system/bt/+/refs/heads/master/stack/btm/btm_sec.cc#2248)
[nimble](https://github.com/apache/mynewt-nimble/blob/2d3705b94f7b5d2493c71abb5ba4d33b3d763735/apps/bttester/src/gap.c#L1079)
[bluez](https://sourcegraph.com/github.com/torvalds/linux@master/-/blob/net/bluetooth/l2cap_core.c#L815)

## SM - Notable Features
// TODO

## CVEs
### Android
* CVE-2019-1991	RCE in SMP [diff](https://android.googlesource.com/platform/system/bt/+/3d21e75aa8c1e0c4adf178a1330f9f5c573ca045)
* CVE-2018-9507	ID in SMP [diff](https://android.googlesource.com/platform/system/bt/+/e8bbf5b0889790cf8616f4004867f0ff656f0551)
* CVE-2018-9509	ID in SMP [diff](https://android.googlesource.com/platform/system/bt/+/198888b8e0163bab7a417161c63e483804ae8e31)
* CVE-2018-9510	ID in SMP [diff](https://android.googlesource.com/platform/system/bt/+/6e4b8e505173f803a5fc05abc09f64eef89dc308)
* CVE-2018-9446 RCE SMP (Check p_cb->role in smp_br_state_machine_event) [diff](https://android.googlesource.com/platform/system/bt/+/49acada519d088d8edf37e48640c76ea5c70e010)
	* Attacker supplied p_cb->role had ended up being used to lookup index in smp_br_state_table, letting you specify what function you wanted to call
	* also in [CVE-2018-9365](https://android.googlesource.com/platform/system/bt/+/ae94a4c333417a1829030c4d87a58ab7f1401308)
	* This was discovered by [Quarkslab](https://blog.quarkslab.com/a-story-about-three-bluetooth-vulnerabilities-in-android.html)

{% highlight c lineanchors %}
if (p_cb->role > HCI_ROLE_SLAVE) { --> state_table = smp_br_state_table[curr_state][p_cb->role];
{% endhighlight %}

* SMP [use after free](https://android.googlesource.com/platform/system/bt/+/fe621261a1f66463df71cfef2bdd037374e3c6b2)

# SDP

This is probably the most sketch protocol in Bluetooth. There is a lot going on with the protocol and it is required to be exposed to all devices so they know what applications the device has registered (e.g. can I send music to you? yes! I have AV controller!). Granted, devices that operate only with BLE do not have this since information is advertised via GATT. However, all mobile devices, cars, and things that need compatability with older protocols will be listening for SDP

## Notable Features
* The SDP `server` handles remote queries of the SDP database which contains information for all registered services for the device. For example...
  * Each Bluetooth protocol is assigned a specific number defined by the [specification](https://www.bluetooth.com/specifications/assigned-numbers/service-discovery/)
  * Higher level applications register themselves to the `server` via the internal SDP API the server exposes (as seen here in btstack for PAN: ). These applications identify themselves to remote devices using `service class identifiers` ([Bluez](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/lib/sdp.h#n78))
  * Each of these higher level protocols use different `data elements` (below) to convey to a remote device how the application is configured (metadata about the bluetooth application), these are identified by `service attribute definitions` (seen here in [Bluez](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/lib/sdp.h#n250)). For example, here is the SDP registration specification for PAN. We can see btstack specifically parsing an RFCOMM SDP entry: `examples/sdp_rfcomm_query.c`
* The SDP `client` performs queries and parses their response
* There are three different queries which can be performed: (TODO fill in these details)
  * ServiceSearchRequest
  * ServiceAttributeRequest
  * ServiceSearchAttributeRequest
* Queries are comprised of `data elements` which are type, length, value structures (seen here: btstack sdp_util.h:105)
  * These `data elements`
* The parsing is relatively complex, I think bluez's implementation is the [clearest](https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/lib/sdp.c)

* If a response is too big, a `continuation state` is created (TODO: Reference specification)
  * This `continuation state` has led to a number of vulnerabilities with Android (TODO: refs) due to the server either trusting the client's state or the internal state becomes corrupt and lengths become out of sync (TODO: ref bluebourne exploit leak)

## Attack Surface
* Since every device must always expose their SDP server (allow JustWorks pairing, see HCI/L2cap) to all nearby devices to tell them what sevices are accessible on the device, this provides a nice no-interaction attack surface. Additionally, a given bluetooth stack might have some sort of automated trigger (see iOS Airpod discovery) which causes it to use its SDP client to send a request and parse a response from the attacker's device. Again, a no-interaction needed attack surface. 
* The SDP protocol is sufficiently complex to most likely contain bugs in any implementation, as shown in researchers digging through Android.

TODO: Run sdp tool on each stack

{% highlight bash lineanchors %}
➜  libusb-intel git:(fuzzable) ✗ sudo ./sdp_l2cap_scan --address 38:CA:DA:85:5F:E1
Packet Log: /tmp/hci_dump.pklg
USB Path: 07
Client HCI init done
BTstack up and running on 18:56:80:04:42:72.

---
Record nr. 0
sdp attribute: 0x0004
summary: uuid 0x0003, l2cap_psm: 0x0000

---
Record nr. 1
sdp attribute: 0x0004
summary: uuid 0x0100, l2cap_psm: 0x000f, name: BNEP
summary: uuid 0x000f, l2cap_psm: 0x0100, name: L2CAP

---
Record nr. 2
sdp attribute: 0x0004
summary: uuid 0x0003, l2cap_psm: 0x0000

---
Record nr. 3
sdp attribute: 0x0004
summary: uuid 0x0003, l2cap_psm: 0x0000

---
Record nr. 4
sdp attribute: 0x0004
summary: uuid 0x0100, l2cap_psm: 0x0017, name: AVCTP
summary: uuid 0x0017, l2cap_psm: 0x0104

---
Record nr. 5
sdp attribute: 0x0004
summary: uuid 0x0100, l2cap_psm: 0x0017, name: AVCTP
summary: uuid 0x0017, l2cap_psm: 0x0104

---
Record nr. 6
sdp attribute: 0x0004
summary: uuid 0x0100, l2cap_psm: 0x0019, name: AVDTP
summary: uuid 0x0019, l2cap_psm: 0x0103

---
Record nr. 7
sdp attribute: 0x0004
summary: uuid 0x0003, l2cap_psm: 0x0000

---
Record nr. 8
sdp attribute: 0x0004
summary: uuid 0x0003, l2cap_psm: 0x0000

---
{% endhighlight %}

This code just dumps out relavant info for understanding the BR/EDR attack surface of a device. For a more comprehensive view of what data SDP holds, check out this full SDP dump for the same device:

{% highlight bash lineanchors %}
➜  libusb-intel git:(master) ✗ sudo ./sdp_general_query 
[sudo] password for breadchris: 
Packet Log: /tmp/hci_dump.pklg
USB Path: 07
Done 0
Client HCI init done
BTstack up and running on 18:56:80:04:42:72.

---
Record nr. 0
Attribute 0x0001: type   DES (6), element len  5 
    type  UUID (3), element len  3 , value: 0x00001132
Attribute 0x0002: type  UINT (1), element len  5 , value: 0x00000000
Attribute 0x0004: type   DES (6), element len 19 
    type   DES (6), element len  5 
        type  UUID (3), element len  3 , value: 0x00000100
    type   DES (6), element len  7 
        type  UUID (3), element len  3 , value: 0x00000003
        type  UINT (1), element len  2 , value: 0x00000002
    type   DES (6), element len  5 
        type  UUID (3), element len  3 , value: 0x00000008
Attribute 0x0005: type   DES (6), element len  5 
    type  UUID (3), element len  3 , value: 0x00001002
Attribute 0x0006: type   DES (6), element len 38 
    type  UINT (1), element len  3 , value: 0x0000656e
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000100
    type  UINT (1), element len  3 , value: 0x00006672
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000110
    type  UINT (1), element len  3 , value: 0x00006465
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000120
    type  UINT (1), element len  3 , value: 0x00006a61
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000130
Attribute 0x0008: type  UINT (1), element len  2 , value: 0x000000ff
Attribute 0x0009: type   DES (6), element len 10 
    type   DES (6), element len  8 
        type  UUID (3), element len  3 , value: 0x00001134
        type  UINT (1), element len  3 , value: 0x00000100
Attribute 0x0100: type STRING (4), element len 13 len 11 (0x0b)
4D 41 50 20 4D 41 53 2D 69 4F 53 
Attribute 0x0315: type  UINT (1), element len  2 , value: 0x00000000
Attribute 0x0316: type  UINT (1), element len  2 , value: 0x0000000a

---
Record nr. 1
Attribute 0x0001: type   DES (6), element len  5 
    type  UUID (3), element len  3 , value: 0x00001116
Attribute 0x0002: type  UINT (1), element len  5 , value: 0x00000018
Attribute 0x0004: type   DES (6), element len 32 
    type   DES (6), element len  8 
        type  UUID (3), element len  3 , value: 0x00000100
        type  UINT (1), element len  3 , value: 0x0000000f
    type   DES (6), element len 22 
        type  UUID (3), element len  3 , value: 0x0000000f
        type  UINT (1), element len  3 , value: 0x00000100
        type   DES (6), element len 14 
            type  UINT (1), element len  3 , value: 0x00000800
            type  UINT (1), element len  3 , value: 0x00000806
            type  UINT (1), element len  3 , value: 0x00008100
            type  UINT (1), element len  3 , value: 0x000086dd
Attribute 0x0005: type   DES (6), element len  5 
    type  UUID (3), element len  3 , value: 0x00001002
Attribute 0x0006: type   DES (6), element len 38 
    type  UINT (1), element len  3 , value: 0x0000656e
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000100
    type  UINT (1), element len  3 , value: 0x00006672
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000110
    type  UINT (1), element len  3 , value: 0x00006465
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000120
    type  UINT (1), element len  3 , value: 0x00006a61
    type  UINT (1), element len  3 , value: 0x0000006a
    type  UINT (1), element len  3 , value: 0x00000130
Attribute 0x0008: type  UINT (1), element len  2 , value: 0x00000000
Attribute 0x0009: type   DES (6), element len 10 
    type   DES (6), element len  8 
        type  UUID (3), element len  3 , value: 0x00001116
        type  UINT (1), element len  3 , value: 0x00000100
Attribute 0x0100: type STRING (4), element len 28 len 26 (0x1a)
50 41 4E 20 4E 65 74 77 6F 72 6B 20 41 63 63 65 73 73 20 50 72 6F 66 69 6C 65 
Attribute 0x0101: type STRING (4), element len 22 len 20 (0x14)
4E 65 74 77 6F 72 6B 20 41 63 63 65 73 73 20 50 6F 69 6E 74 
Attribute 0x030a: type  UINT (1), element len  3 , value: 0x00000001
Attribute 0x030b: type  UINT (1), element len  3 , value: 0x0000000d
Attribute 0x030c: type  UINT (1), element len  5 , value: 0x0003e800

---
Record nr. 2
Attribute 0x0001: type   DES (6), element len 19 
    type  UUID (3), element len 17 , value: 02030302-1D19-415F-86F2-22A2106A0A77
Attribute 0x0002: type  UINT (1), element len  5 , value: 0x00000000
Attribute 0x0004: type   DES (6), element len 14 
    type   DES (6), element len  5 
        type  UUID (3), element len  3 , value: 0x00000100
    type   DES (6), element len  7 
        type  UUID (3), element len  3 , value: 0x00000003
        type  UINT (1), element len  2 , value: 0x00000001
...
{% endhighlight %}

## CVEs
### Android
* CVE-2018-9478	SDP RCE [diff](https://android.googlesource.com/platform/system/bt/+/68688194eade113ad31687a730e8d4102ada58d5)
    - Hard to exploit: You can cause memcpy to copy a huge amount of bytes onto the heap, but where you need to control data to write the heap cookie you aren't able to control it.
    - More details in the [presentation](https://github.com/JiounDai/Bluedroid/blob/master/Dissect%20Android%20Bluetooth%20for%20Fun%20%26%20Profit.pdf)
* CVE-2018-9590	SDP ID [diff](https://android.googlesource.com/platform/system/bt/+/297598898683b81e921474e6e74c0ddaedbb8bb5)
{% highlight c lineanchors %}
diff --git a/stack/sdp/sdp_discovery.cc b/stack/sdp/sdp_discovery.cc
index 95f55bf..1ca2ad3 100644
--- a/stack/sdp/sdp_discovery.cc
+++ b/stack/sdp/sdp_discovery.cc
@@ -55,7 +55,7 @@
 static uint8_t* save_attr_seq(tCONN_CB* p_ccb, uint8_t* p, uint8_t* p_msg_end);
 static tSDP_DISC_REC* add_record(tSDP_DISCOVERY_DB* p_db,
                                  const RawAddress& p_bda);
-static uint8_t* add_attr(uint8_t* p, tSDP_DISCOVERY_DB* p_db,
+static uint8_t* add_attr(uint8_t* p, uint8_t* p_end, tSDP_DISCOVERY_DB* p_db,
                          tSDP_DISC_REC* p_rec, uint16_t attr_id,
                          tSDP_DISC_ATTR* p_parent_attr, uint8_t nest_level);
 
@@ -770,7 +770,7 @@
     BE_STREAM_TO_UINT16(attr_id, p);
 
     /* Now, add the attribute value */
-    p = add_attr(p, p_ccb->p_db, p_rec, attr_id, NULL, 0);
+    p = add_attr(p, p_seq_end, p_ccb->p_db, p_rec, attr_id, NULL, 0);
 
     if (!p) {
       SDP_TRACE_WARNING("SDP - DB full add_attr");
@@ -830,7 +830,7 @@
  * Returns          pointer to next byte in data stream
  *
  ******************************************************************************/
-static uint8_t* add_attr(uint8_t* p, tSDP_DISCOVERY_DB* p_db,
+static uint8_t* add_attr(uint8_t* p, uint8_t* p_end, tSDP_DISCOVERY_DB* p_db,
                          tSDP_DISC_REC* p_rec, uint16_t attr_id,
                          tSDP_DISC_ATTR* p_parent_attr, uint8_t nest_level) {
   tSDP_DISC_ATTR* p_attr;
@@ -839,7 +839,7 @@
   uint16_t attr_type;
   uint16_t id;
   uint8_t type;
-  uint8_t* p_end;
+  uint8_t* p_attr_end;
   uint8_t is_additional_list = nest_level & SDP_ADDITIONAL_LIST_MASK;
 
   nest_level &= ~(SDP_ADDITIONAL_LIST_MASK);
@@ -856,6 +856,13 @@
   else
     total_len = sizeof(tSDP_DISC_ATTR);
 
+  p_attr_end = p + attr_len;
+  if (p_attr_end > p_end) {
+    android_errorWriteLog(0x534e4554, "115900043");
+    SDP_TRACE_WARNING("%s: SDP - Attribute length beyond p_end", __func__);
+    return NULL;
+  }
+
   /* Ensure it is a multiple of 4 */
   total_len = (total_len + 3) & ~3;
 
@@ -879,18 +886,17 @@
            * sub-attributes */
           p_db->p_free_mem += sizeof(tSDP_DISC_ATTR);
           p_db->mem_free -= sizeof(tSDP_DISC_ATTR);
-          p_end = p + attr_len;
           total_len = 0;
 
           /* SDP_TRACE_DEBUG ("SDP - attr nest level:%d(list)", nest_level); */
           if (nest_level >= MAX_NEST_LEVELS) {
             SDP_TRACE_ERROR("SDP - attr nesting too deep");
-            return (p_end);
+            return p_attr_end;
           }
 
           /* Now, add the list entry */
-          p = add_attr(p, p_db, p_rec, ATTR_ID_PROTOCOL_DESC_LIST, p_attr,
-                       (uint8_t)(nest_level + 1));
+          p = add_attr(p, p_end, p_db, p_rec, ATTR_ID_PROTOCOL_DESC_LIST,
+                       p_attr, (uint8_t)(nest_level + 1));
 
           break;
         }
@@ -949,7 +955,7 @@
           break;
         default:
           SDP_TRACE_WARNING("SDP - bad len in UUID attr: %d", attr_len);
-          return (p + attr_len);
+          return p_attr_end;
       }
       break;
 
@@ -959,22 +965,22 @@
        * sub-attributes */
       p_db->p_free_mem += sizeof(tSDP_DISC_ATTR);
       p_db->mem_free -= sizeof(tSDP_DISC_ATTR);
-      p_end = p + attr_len;
       total_len = 0;
 
       /* SDP_TRACE_DEBUG ("SDP - attr nest level:%d", nest_level); */
       if (nest_level >= MAX_NEST_LEVELS) {
         SDP_TRACE_ERROR("SDP - attr nesting too deep");
-        return (p_end);
+        return p_attr_end;
       }
       if (is_additional_list != 0 ||
           attr_id == ATTR_ID_ADDITION_PROTO_DESC_LISTS)
         nest_level |= SDP_ADDITIONAL_LIST_MASK;
       /* SDP_TRACE_DEBUG ("SDP - attr nest level:0x%x(finish)", nest_level); */
 
-      while (p < p_end) {
+      while (p < p_attr_end) {
         /* Now, add the list entry */
-        p = add_attr(p, p_db, p_rec, 0, p_attr, (uint8_t)(nest_level + 1));
+        p = add_attr(p, p_end, p_db, p_rec, 0, p_attr,
+                     (uint8_t)(nest_level + 1));
 
         if (!p) return (NULL);
       }
@@ -992,7 +998,7 @@
           break;
         default:
           SDP_TRACE_WARNING("SDP - bad len in boolean attr: %d", attr_len);
-          return (p + attr_len);
+          return p_attr_end;
       }
       break;
 
{% endhighlight %}

* CVE-2018-9566	SDP ID [diff](https://android.googlesource.com/platform/system/bt/+/314336a22d781f54ed7394645a50f74d6743267d)
  - No length check
{% highlight c lineanchors %}
+  if (p_reply + 8 > p_reply_end) {
+    android_errorWriteLog(0x534e4554, "74249842");
+    sdp_disconnect(p_ccb, SDP_GENERIC_ERROR);
+    return;
+  }
   /* Skip transaction, and param len */
   p_reply += 4;
   BE_STREAM_TO_UINT16(total, p_reply);
// ...
+  if (p_reply + ((p_ccb->num_handles - orig) * 4) + 1 > p_reply_end) {
+    android_errorWriteLog(0x534e4554, "74249842");
+    sdp_disconnect(p_ccb, SDP_GENERIC_ERROR);
+    return;
+  }
+
   for (xx = orig; xx < p_ccb->num_handles; xx++)
     BE_STREAM_TO_UINT32(p_ccb->handles[xx], p_reply);
{% endhighlight %}
* CVE-2018-9562	SDP ID in client [diff](https://android.googlesource.com/platform/system/bt/+/1bb14c41a72978c6075c5753a8301ddcbb10d409)
  - This one is actually pretty interesting. `num_uuid` was previously set to 2 which when copying from `uuid_list` (located on the stack as `Uuid uuid_list[1];`) would copy an additional `sizeof(Uuid)` bytes into the `uuid_filters` array for the SDP entry. This data would then be sent if device received a service search attribute response (sdp_discovery.cc:584) and a continuation request is needed (sdp_discovery.cc:563).
{% highlight c lineanchors %}
Uuid uuid_list[1];
...
num_uuid = 2;
...
for (xx = 0; xx < num_uuid; xx++) p_db->uuid_filters[xx] = *p_uuid_list++;
...
p = sdpu_build_uuid_seq(p, p_ccb->p_db->num_uuid_filters,
                             p_ccb->p_db->uuid_filters);
...
L2CA_DataWrite(p_ccb->connection_id, p_msg);
{% endhighlight %}
* CVE-2018-9504	ID in SDP [diff](https://android.googlesource.com/platform/system/bt/+/11fb7aa03437eccac98d90ca2de1730a02a515e2)
    - ID in the client while saving response from attacker
{% highlight c lineanchors %}
static void sdp_copy_raw_data(tCONN_CB* p_ccb, bool offset) {
  unsigned int cpy_len, rem_len;
  uint32_t list_len;
  uint8_t* p;
  uint8_t type;
#if (SDP_DEBUG_RAW == TRUE)
  uint8_t num_array[SDP_MAX_LIST_BYTE_COUNT];
  uint32_t i;
  for (i = 0; i < p_ccb->list_len; i++) {
    snprintf((char*)&num_array[i * 2], sizeof(num_array) - i * 2, "%02X",
             (uint8_t)(p_ccb->rsp_list[i]));
  }
  SDP_TRACE_WARNING("result :%s", num_array);
#endif
  if (p_ccb->p_db->raw_data) {
    cpy_len = p_ccb->p_db->raw_size - p_ccb->p_db->raw_used;
    list_len = p_ccb->list_len;
     p = &p_ccb->rsp_list[0];

     if (offset) {
+      cpy_len -= 1;
       type = *p++;
+      uint8_t* old_p = p;
       p = sdpu_get_len_from_type(p, type, &list_len);
+      if ((int)cpy_len < (p - old_p)) {
+        SDP_TRACE_WARNING("%s: no bytes left for data", __func__);
+        return;
+      }
+      cpy_len -= (p - old_p);
     }
    if (list_len < cpy_len) {
      cpy_len = list_len;
    }
    rem_len = SDP_MAX_LIST_BYTE_COUNT - (unsigned int)(p - &p_ccb->rsp_list[0]);
    if (cpy_len > rem_len) {
      SDP_TRACE_WARNING("rem_len :%d less than cpy_len:%d", rem_len, cpy_len);
      cpy_len = rem_len;
    }
    memcpy(&p_ccb->p_db->raw_data[p_ccb->p_db->raw_used], p, cpy_len);
    p_ccb->p_db->raw_used += cpy_len;
{% endhighlight %}
* CVE-2018-9355 RCE in SDP while processing data returned when looking up records [diff](https://android.googlesource.com/platform/system/bt/+/99a263a7f04c5c6f101388007baa18cf1e8c30bf)
{% highlight c lineanchors %}
// stack based buffer overflow - Stack array of arrays which has a set length, but will copy how every many times the client told it to
/*******************************************************************************
 *
 * Function         bta_dm_sdp_result
 *
 * Description      Process the discovery result from sdp
void bta_dm_sdp_result(tBTA_DM_MSG* p_data) {
...
-  uint8_t uuid_list[32][MAX_UUID_SIZE];  // assuming a max of 32 services
+  uint8_t uuid_list[BTA_MAX_SERVICES][MAX_UUID_SIZE];  // assuming a max of 32 services
                 bta_service_id_to_uuid_lkup_tbl[bta_dm_search_cb.service_index -
                                                 1];
             /* Add to the list of UUIDs */
-            sdpu_uuid16_to_uuid128(tmp_svc, uuid_list[num_uuids]);
-            num_uuids++;
+            if (num_uuids < BTA_MAX_SERVICES) {
+              sdpu_uuid16_to_uuid128(tmp_svc, uuid_list[num_uuids]);
+              num_uuids++;
+            } else {
+              android_errorWriteLog(0x534e4554, "74016921");
+            }
           }
         }
       }
...
             SDP_FindServiceInDb_128bit(bta_dm_search_cb.p_sdp_db, p_sdp_rec);
         if (p_sdp_rec) {
           if (SDP_FindServiceUUIDInRec_128bit(p_sdp_rec, &temp_uuid)) {
-            memcpy(uuid_list[num_uuids], temp_uuid.uu.uuid128, MAX_UUID_SIZE);
-            num_uuids++;
+            if (num_uuids < BTA_MAX_SERVICES) {
+              memcpy(uuid_list[num_uuids], temp_uuid.uu.uuid128, MAX_UUID_SIZE);
+              num_uuids++;
+            } else {
+              android_errorWriteLog(0x534e4554, "74016921");
+            }
           }
         }
       } while (p_sdp_rec);
{% endhighlight %}
* CVE-2017-13255 SDP RCE [diff](https://android.googlesource.com/platform/system/bt/+/f0edf6571d2d58e66ee0b100ebe49c585d31489f)
* CVE-2017-13290 SDP ID [diff]https://android.googlesource.com/platform/system/bt/+/72b1cebaa9cc7ace841d887f0d4a4bf6daccde6e)
  * The end of the request was never checked. This is the same problem as seen in other areas of the stack, but the approach to fixing is a lot more consistent than other fixes.
  * The end of the request is checked accross many different functions with this patch.
{% highlight c lineanchors %}
 static void process_service_search_attr_req(tCONN_CB* p_ccb, uint16_t trans_num,
                                             uint16_t param_len, uint8_t* p_req,
-                                            UNUSED_ATTR uint8_t* p_req_end);
+                                            uint8_t* p_req_end);

+
+  if (p_req + sizeof(param_len) > p_req_end) {
+    android_errorWriteLog(0x534e4554, "69384124");
+    sdpu_build_n_send_error(p_ccb, trans_num, SDP_INVALID_REQ_SYNTAX,
+                            SDP_TEXT_BAD_HEADER);
+  }
+
   BE_STREAM_TO_UINT16(param_len, p_req);
{% endhighlight %}
* CVE-2017-13259 SDP ID [diff](https://android.googlesource.com/platform/system/bt/+/0627e76edefd948dc3efe11564d7e53d56aac80c)
  * Similar to CVE-2017-13290 but this fixes reading from the end of the request in the client.
{% highlight c lineanchors %}
+static void process_service_search_rsp(tCONN_CB* p_ccb, uint8_t* p_reply,
+                                       uint8_t* p_reply_end);


+    if (p_reply + cont_len > p_reply_end) {
+      android_errorWriteLog(0x534e4554, "68161546");
+      sdp_disconnect(p_ccb, SDP_INVALID_CONT_STATE);
+      return;
+    }
{% endhighlight %}

# BNEP and PAN

## Notable Features
### BNEP (btstack: btstack/src/classic/bnep.c)
* Protocol that PAN operates on. In case some other service wanted to implement some network-esc thing? I have only ever seen PAN use this protocol...
* The protocol is not terribly interesting, most implementations ignore certain parts of the specification because they are literally never used lol (TODO link to linux extension bit).

### PAN
* Different roles PANU, NU, GN

## Attack Surface
TODO

## CVEs
* CVE-2017-0782	(Add a missing check for PAN buffer size before copying data) [diff](https://android.googlesource.com/platform/system/bt/+/4e47f3db62bab524946c46efe04ed6a2b896b150) and (Add missing extension length check while parsing BNEP control packets
) [diff](https://android.googlesource.com/platform/system/bt/+/c568fa9088ded964e0ac99db236e612de5d82177)
	* this code will always overflow (see bluebourne paper)
{% highlight c lineanchors %}
   if (sizeof(tBTA_PAN_DATA_PARAMS) > p_buf->offset) {
     /* offset smaller than data structure in front of actual data */
+    if (sizeof(BT_HDR) + sizeof(tBTA_PAN_DATA_PARAMS) + p_buf->len >
+        PAN_BUF_SIZE) {
+      android_errorWriteLog(0x534e4554, "63146237");
+      APPL_TRACE_ERROR("%s: received buffer length too large: %d", __func__,
+                       p_buf->len);
+      osi_free(p_buf);
+      return;
+    }
     p_new_buf = (BT_HDR*)osi_malloc(PAN_BUF_SIZE);
     memcpy((uint8_t*)(p_new_buf + 1) + sizeof(tBTA_PAN_DATA_PARAMS),
            (uint8_t*)(p_buf + 1) + p_buf->offset, p_buf->len);
{% endhighlight %}
* CVE-2017-0783	(Disable PAN Reverse Tethering when connection originated by the Remote) [diff](https://android.googlesource.com/platform/system/bt/+/1e77fefc8b9c832239e1b32c6a6880376065e24e)
	* see bluebourne paper
* PAN Use after free [diff](https://android.googlesource.com/platform/system/bt/+/08e68337a9eb45818d5a770570c8b1d15a14d904)
	* Regression described in bluedroid
* BNEP ID [diff](https://android.googlesource.com/platform/system/bt/+/a50e70468c0a8d207e416e273d05a08635bdd45f)
	* Check out the writeup by [Quarkslab](https://blog.quarkslab.com/android-bluetooth-vulnerabilities-in-the-march-2018-security-bulletin.html)
* CVE-2018-9436	ID in BNEP [diff](https://android.googlesource.com/platform/system/bt/+/289a49814aef7f0f0bb98aac8246080abdfeac01)
	* Length check is missing, you can position `p` so that it points to the byte after the packet and if it is > BNEP_FILTER_MULTI_ADDR_RESPONSE_MSG then it will be sent back
	* Check out the writeup by [Quarkslab](https://blog.quarkslab.com/android-bluetooth-vulnerabilities-in-the-march-2018-security-bulletin.html)
{% highlight c lineanchors %}
+        if ((ext & 0x7F) == BNEP_EXTENSION_FILTER_CONTROL) {
+          if (length == 0) {
+            android_errorWriteLog(0x534e4554, "79164722");
+            break;
+          }
+          if (*p > BNEP_FILTER_MULTI_ADDR_RESPONSE_MSG) {
+            bnep_send_command_not_understood(p_bcb, *p);
+          }
+        }
+
+        p += length;
{% endhighlight %}
* CVE-2018-9356	RCE in PAN [diff](https://android.googlesource.com/platform/system/bt/+/d7d4d5686b2e3c37c7bf10a6a2adff1c95251a13)
	* Fix for UAF?
* CVE-2018-9357 RCE in BNEP [diff](https://android.googlesource.com/platform/system/bt/+/9164ee1aaf3609b4771d39302e3af649f44c9e66)
	* BNEP_Write -> `if (new_len > org_len) return BNEP_IGNORE_CMD;` were placed because extension bit could let you make big writes

# AVRCP and AVTDP

## Notable Features
* Controls audio

## Stack Implementations
* Need to pair with device to access it on Android

Android:
bta_av_api.h:
{% highlight c lineanchors %}
/* Set to TRUE if seperate authorization prompt desired for AVCTP besides A2DP
 * authorization */
/* Typically FALSE when AVRCP is used in conjunction with A2DP */
#ifndef BTA_AV_WITH_AVCTP_AUTHORIZATION
{% endhighlight %}

## CVEs
### Android
* CVE-2017-13281 really good length check in AVRCP [diff](https://android.googlesource.com/platform/system/bt/+/6f3ddf3f5cf2b3eb52fb0adabd814a45cff07221%5E%21/)
  - length check, but it is just plain wrong lol
{% highlight c lineanchors %}
-        if (buf_len > p_result->search.string.str_len)
-          buf_len = p_result->search.string.str_len;
+        if (p_result->search.string.str_len > buf_len) {
+          p_result->search.string.str_len = buf_len;
+        } else {
+          android_errorWriteLog(0x534e4554, "63146237");
+        }
{% endhighlight %}
* CVE-2019-1996	AVRCP ID [diff](https://android.googlesource.com/platform/system/bt/+/525bdbd6e1295ed8a081d2ae87105c64d6f1ac4f)
No length checks
{% highlight c lineanchors %}
+            min_len += 10 + AVRC_FEATURE_MASK_SIZE;
+            if (pkt_len < min_len) goto browse_length_error;
             BE_STREAM_TO_UINT16(player_len, p);
             BE_STREAM_TO_UINT16(player->player_id, p);
             BE_STREAM_TO_UINT8(player->major_type, p);
             BE_STREAM_TO_UINT32(player->sub_type, p);
             BE_STREAM_TO_UINT8(player->play_status, p);
             BE_STREAM_TO_ARRAY(p, player->features, AVRC_FEATURE_MASK_SIZE);
{% endhighlight %}
* CVE-2018-9588	AVDP ID [diff](https://android.googlesource.com/platform/system/bt/+/bf9ff0c5215861ab673e211cd06e009f3157aab2)
  - This is a juicy info leak
  - No length checks
{% highlight c lineanchors %}
+        min_len += 20;
+        if (min_len > len) {
+          android_errorWriteLog(0x534e4554, "111450156");
+          AVDT_TRACE_WARNING(
+              "%s: hdl packet length %d too short: must be at least %d",
+              __func__, len, min_len);
+          goto avdt_scb_hdl_report_exit;
+        }
         BE_STREAM_TO_UINT32(report.sr.ntp_sec, p);
         BE_STREAM_TO_UINT32(report.sr.ntp_frac, p);
         BE_STREAM_TO_UINT32(report.sr.rtp_time, p);
{% endhighlight %}
* CVE-2018-9542	ID in AVRCP [diff](https://android.googlesource.com/platform/system/bt/+/cc364611362cc5bc896b400bdc471a617d1ac628)
No length checks are performed
{% highlight c lineanchors %}
+    if (len < 1) {
+      android_errorWriteLog(0x534e4554, "111450531");
+      AVRC_TRACE_WARNING("%s: invalid parameter length %d: must be at least 1",
+                         __func__, len);
+      return AVRC_STS_INTERNAL_ERR;
+    }
     p_result->rsp.status = *p;
{% endhighlight %}
* CVE-2017-13283 RCE (Easy to exploit) [diff](https://android.googlesource.com/platform/system/bt/+/ebc284cf3a59ee5cf7c06af88c2f3bcd0480e3e9)
  - Read length from packet is not properly verified. This controls data being read into an allocation.
{% highlight c lineanchors %}
       BE_STREAM_TO_UINT8(p_result->list_app_values.num_val, p);
+      if (p_result->list_app_values.num_val > AVRC_MAX_APP_ATTR_SIZE) {
+        android_errorWriteLog(0x534e4554, "78526423");
+        p_result->list_app_values.num_val = AVRC_MAX_APP_ATTR_SIZE;
+      }
+
       for (int xx = 0; xx < p_result->list_app_values.num_val; xx++) {
        BE_STREAM_TO_UINT8(p_result->list_app_values.vals[xx], p);
      }
{% endhighlight %}

* CVE-2018-9506	ID in AVRCP [diff](https://android.googlesource.com/platform/system/bt/+/830cb39cb2a0f1bf6704d264e2a5c5029c175dd7)
  - No length check
{% highlight c lineanchors %}
+    if (p_pkt->len < AVRC_AVC_HDR_SIZE) {
+      android_errorWriteLog(0x534e4554, "111803925");
+      AVRC_TRACE_WARNING("%s: message length %d too short: must be at least %d",
+                         __func__, p_pkt->len, AVRC_AVC_HDR_SIZE);
+      osi_free(p_pkt);
+      return;
+    }
     msg.hdr.ctype = p_data[0] & AVRC_CTYPE_MASK;
{% endhighlight %}
* CVE-2018-9507	ID in AVRCP [diff](https://android.googlesource.com/platform/system/bt/+/30cec963095366536ca0b1306089154e09bfe1a9)
  - No length check
{% highlight c lineanchors %}
+        if (p_vendor->vendor_len != 5) {
+          android_errorWriteLog(0x534e4554, "111893951");
+          p_rc_rsp->get_caps.status = AVRC_STS_INTERNAL_ERR;
+          break;
+        }
         u8 = *(p_vendor->p_vendor_data + 4);
         p = p_vendor->p_vendor_data + 2;
         p_rc_rsp->get_caps.capability_id = u8;
         BE_STREAM_TO_UINT16(u16, p);
{% endhighlight %}
* CVE-2018-9450	RCE [diff](https://android.googlesource.com/platform/system/bt/+/bc259b4926a6f9b33b9ee2c917cd83a55f360cbf)
since the original packet is being reused, we are copying a certain number of bytes past the end?
not too sure about this one
{% highlight c lineanchors %}
avrc_proc_vendor_command
   if (status != AVRC_STS_NO_ERROR) {
-    /* use the current GKI buffer to build/send the reject message */
-    p_data = (uint8_t*)(p_pkt + 1) + p_pkt->offset;
+    p_rsp = (BT_HDR*)osi_malloc(BT_DEFAULT_BUFFER_SIZE);
+    p_rsp->offset = p_pkt->offset;
+    p_data = (uint8_t*)(p_rsp + 1) + p_pkt->offset;
     *p_data++ = AVRC_RSP_REJ;
     p_data += AVRC_VENDOR_HDR_SIZE; /* pdu */
     *p_data++ = 0;                  /* pkt_type */
     UINT16_TO_BE_STREAM(p_data, 1); /* len */
     *p_data++ = status;             /* error code */
-    p_pkt->len = AVRC_VENDOR_HDR_SIZE + 5;
-    p_rsp = p_pkt;
+    p_rsp->len = AVRC_VENDOR_HDR_SIZE + 5;
   }
{% endhighlight %}
* CVE-2018-9540	ID - "In avrc_ctrl_pars_vendor_rsp of avrc_pars_ct.c, there is a possible out of bounds read due to a missing bounds check." [diff](https://android.googlesource.com/platform/system/bt/+/99d54d0c7dbab6c80f15bbf886ed203b2a547453)

{% highlight c lineanchors %}
-void avrc_parse_notification_rsp(uint8_t* p_stream,
-                                 tAVRC_REG_NOTIF_RSP* p_rsp) {
+tAVRC_STS avrc_parse_notification_rsp(uint8_t* p_stream, uint16_t len,
+                                      tAVRC_REG_NOTIF_RSP* p_rsp) {
+  uint16_t min_len = 1;
+
+  if (len < min_len) goto length_error;
   BE_STREAM_TO_UINT8(p_rsp->event_id, p_stream);
   switch (p_rsp->event_id) {
     case AVRC_EVT_PLAY_STATUS_CHANGE:
+      min_len += 1;
+      if (len < min_len) goto length_error;
       BE_STREAM_TO_UINT8(p_rsp->param.play_status, p_stream);
       break;
{% endhighlight %}
* (CVE-2017-13266) RCE [diff](https://android.googlesource.com/platform/system/bt/+/6ecbbc093f4383e90cbbf681cd55da1303a8ef94)
{% highlight c lineanchors %}
static tAVRC_STS avrc_ctrl_pars_vendor_rsp(tAVRC_MSG_VENDOR* p_msg,
                                           tAVRC_RESPONSE* p_result,
                                           uint8_t* p_buf, uint16_t* buf_len) {
  uint8_t* p = p_msg->p_vendor_data;
  BE_STREAM_TO_UINT8(p_result->pdu, p);
  p++; /* skip the reserved/packe_type byte */
  uint16_t len;
  BE_STREAM_TO_UINT16(len, p);
  AVRC_TRACE_DEBUG("%s ctype:0x%x pdu:0x%x, len:%d", __func__, p_msg->hdr.ctype,
                   p_result->pdu, len);
  /* Todo: Issue in handling reject, check */
  if (p_msg->hdr.ctype == AVRC_RSP_REJ) {
    p_result->rsp.status = *p;
    return p_result->rsp.status;
  }
  /* TODO: Break the big switch into functions. */
  switch (p_result->pdu) {
  ...
  case AVRC_PDU_LIST_PLAYER_APP_ATTR:
      if (len == 0) {
        p_result->list_app_attr.num_attr = 0;
        break;
      }
      BE_STREAM_TO_UINT8(p_result->list_app_attr.num_attr, p);
      AVRC_TRACE_DEBUG("%s attr count = %d ", __func__,
                       p_result->list_app_attr.num_attr);
      if (p_result->list_app_attr.num_attr > AVRC_MAX_APP_ATTR_SIZE) {
        android_errorWriteLog(0x534e4554, "63146237");
        p_result->list_app_attr.num_attr = AVRC_MAX_APP_ATTR_SIZE;
      }
      for (int xx = 0; xx < p_result->list_app_attr.num_attr; xx++) {
        BE_STREAM_TO_UINT8(p_result->list_app_attr.attrs[xx], p);
      }
      break;
{% endhighlight %}
* CVE-2018-9448	ID in AVRCP [diff](https://android.googlesource.com/platform/system/bt/+/13294c70a66347c9e5d05b9f92f8ceb6fe38d7f6)
  - No length check
{% highlight c lineanchors %}
+  if (p_data->p_buf->len < AVCT_HDR_LEN_SINGLE) {
+    AVCT_TRACE_WARNING("Invalid AVCTP packet length %d: must be at least %d",
+                       p_data->p_buf->len, AVCT_HDR_LEN_SINGLE);
+    osi_free_and_reset((void**)&p_data->p_buf);
+    android_errorWriteLog(0x534e4554, "79944113");
+    return;
+  }
+
   p = (uint8_t*)(p_data->p_buf + 1) + p_data->p_buf->offset;
{% endhighlight %}
* CVE-2018-9453	ID in AVDTP [diff](https://android.googlesource.com/platform/system/bt/+/cb6a56b1d8cdab7c495ea8f53dcbdb3cfc9477d2)
  - Possible RCE?
{% highlight c lineanchors %}
+        if (p + elem_len > p_end) {
+          err = AVDT_ERR_LENGTH;
+          android_errorWriteLog(0x534e4554, "78288378");
+          break;
+        }
{% endhighlight %}

# ATT and GATT

## Notable features
* ATT and GATT are kind of tied into each other
* It is basically a glorified database which uses UUIDs to identify elements to read and/or write
* Service, characteristics, attributes

## Attack surface
* The code for each off the different actions is relatively limited in what it does (hence the "low energy"). So for as far as exploiting the GATT protocol, there is little room for vulnerabilities to be introduced.
* There is a lot of research published on exploiting applications which use GATT (bleah) by identifying information that is exposed and properties that are able to be written to.
* A really cool challenge that you can try out to learn about BLE application layer hacking is here: https://github.com/hackgnar/ble_ctf

## CVEs

### Android
* CVE-2017-13160 bta gattc Priv esc? [diff](https://android.googlesource.com/platform/system/bt/+/68a1cf1a9de115b66bececf892588075595b263f)
  - Loads GATT cache with incorrect size
* CVE-2018-9358	UNUSED_ATTR in length for gatt [diff](https://android.googlesource.com/platform/system/bt/+/0d7c2f5a14d1055f3b4f69035451c66bf8f1b08e)
  - len is not used
{% highlight c lineanchors %}
+  if (len < sizeof(flag)) {
+    android_errorWriteLog(0x534e4554, "73172115");
+    LOG(ERROR) << __func__ << "invalid length";
+    gatt_send_error_rsp(tcb, GATT_INVALID_PDU, GATT_REQ_EXEC_WRITE, 0, false);
+    return;
+  }
+
   STREAM_TO_UINT8(flag, p);
{% endhighlight %}

# Conclusions
* Security is hard, especially when you are implementing code to match a specification that has a number of protocols some legacy, some new.
* When you are parsing data, for the love of god, properly keep track of where you are. Linux and iOS do this well by having the position in the packet always being kept updated and checked. Android fails to do this and is the root cause of the majority of the CVEs that have been reported.

## Attack surface
* Following the [guidelines put forth by NIST](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-121r2.pdf), a Bluetooth stack can take some steps to become secure to the passer by attacker. While a Bluetooth social engineering attack (prompting the user to pair a device) can open up the attack surface to other protocols, it does put at least some barrier to protect devices from rampantly spreading malware.

## Vulnerability Patterns
* It is important to identify vulnerability trends and cut the head off the Hydra before you have new ones. As seen in reported Bluetooth vulnerabilities in Android, the head was not cut off. You have patches which fix a vulnerability, but create a new one (BNEP UAF), lack of length checks (all the information disclosures), and overall neglect of properly checking lengths in general (AVCTP length check, the bnep off by one).
* [Google's blog post](https://security.googleblog.com/2019/05/queue-hardening-enhancements.html) about security improvements in Android Q was very exciting since they are using data drive their security efforts in creating analyses which stop bug pattens like these.
