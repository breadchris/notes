---
title: "I hacked my high school, and you should too"
date: "2024-01-26"
author: breadchris
tags:
  - blog
  - security
---

I have worked for Northrop Grumman and Uber as a security engineer and I built security tools that have been used around the world. The coolest thing that I have done in my life is that I got to help young hackers break into stuff legally.

## Key Exploits Documented

### Administrative Access

The team used Ophcrack to extract password hashes from Windows XP machines, then performed rainbow table lookups. We discovered admin credentials were "a 6 digit alphanumeric string" across all school computers.

### Windows 7 Upgrade Workaround

When BIOS protection was added, we removed the CMOS battery to reset settings, successfully accessing updated systems using the same password discovery method.

### WiFi Access

After gaining admin privileges on Mac laptops, we logged in and got the password to the school's WPA2-secured network.

### Security Cameras

Using network reconnaissance (ping sweeps across subnets), we located IQeye cameras on the 172.16.0.0 range. After exploiting a documented vulnerability, we cracked the default password and discovered it followed the pattern "mcps_[schoolcode]."

## Broader Arguments

Restrictive content filtering drives student innovation rather than preventing it. Educators should provide legitimate hacking environments like the teacher who "wheels a massive server rack around his classroom."
