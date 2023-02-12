---
title: "When upgrades go wrong"
date: "2013-11-19"
excerpt: "Today I collected some new goodies from @NovatechLtd Razer Taipan Mouse Razer Tiamat Analog Headset Asus Xonar D2X Soundcard Previously I had a Roccat Kova[+] costing around £65, it lasted nearly 2 years, which was excellent considering the amount of hours it had been used and it was still fully functioning, just the rubbery wax the mouse was covered in for grip was start to peel off"
---

Today I collected some new goodies from [@NovatechLtd](https://twitter.com/NovatechLtd)

- Razer Taipan Mouse
- Razer Tiamat Analog Headset
- Asus Xonar D2X Soundcard

Previously I had a [Roccat Kova[+]](http://www.roccat.org/Support/Gaming-Mice/roccat-Kova-/) costing around £65, it lasted nearly 2 years, which was excellent considering the amount of hours it had been used and it was still fully functioning, just the rubbery wax the mouse was covered in for grip was starting to peel off and make a mess. Also had a [Coolermaster Storm Sirus](http://www.coolermaster-usa.com/product.php?product_id=3048) headset which was utter pants, very disappointed with this headset considering it cost around the £90 mark. I had returned one of the headsets upon receiving it because the quality was so bad and the mic was that of a £1 special from Poundland, however returning it turned out to be such a palaver it just wasn't worth returning the second headset for credit (they didn't have any similarly priced headsets to exchange it with and would not give a refund), it cost £15 postage to ship it back to Aria in Manchester, of which Aria would only reimburse me a maximum of £10, suffice to say, I don't shop there anymore.

<blockquote class="twitter-tweet" lang="en"><p dir="ltr" lang="en">Picked up some new goodies from <a href="https://twitter.com/NovatechLtd">@NovatechLtd</a> <a href="http://t.co/OfPYAJZUtd">pic.twitter.com/OfPYAJZUtd</a></p>— Wade Urry (@iWader) <a href="https://twitter.com/iWader/status/402485993481060352">November 18, 2013</a></blockquote>

## Oh boy! New Things

So first things first I set about installing the [Asus Xonar D2X](http://www.asus.com/Sound_Cards_and_DigitaltoAnalog_Converters/Xonar_D2X/). It slotted in nicely above my GTX 680s, it was a bit fiddly trying to connect the power, though in hindsight I should have connected the supplied 4-pin power extension which would have made it easier to connect, anyway with that installed, powered on the PC and it blue screened a couple of times and after a few reboots it was back and functioning, so I proceeded to install the drivers after downloading the latest available from the website. Blue Screened again as soon as I started the installation process and upon rebooting it looks like it screwed something up. Neither network adapter reported as working, even though I did still have internet access, as well as the audio service refused to start, so no sound.

I gave the drivers another attempt of installing and this time things went a bit more smoothly, but upon rebooting still no network devices reported as working and again the audio service refused to start.

## Refresh

So after a quick while googling the issue I discovered this pretty awesome new feature in Windows 8, the ability to do a "refresh" of Windows without losing documents or settings. This process would take a backup of all your documents, settings, etc. reinstall windows, and then restore your data. Theres also an option to do a clean install of Windows, which wouldn't restore your data, as if it was clean from the factory. The best part about this was that it required no tampering in the BIOS settings, only to just insert the Windows install or recovery disk, this made the process of reinstalling Windows so simple that I could even guide my grandmother through it over the phone. This simplicity will certainly come in handy for a lot of people that have little technical knowledge and would otherwise need to take their computer to a shop, where often the quickest solution to solving a problem is to flatten and reinstall Windows.

## This Media Is Not Valid

Unfortunately my hopes of a speedy solution to my problem was crushed when it refused to acknowledge my Windows 8 install disk, I assume this is because I had opted to upgrade to 8.1 and my disk was for 8. So I proceeded to take a backup of my documents, ssh keys, etc. Although I have backups of my system its just easier to copy my stuff to a separate drive and copy it back once done. Luckily I keep most of my data on separate drives which makes reinstalling pretty straight forward. Anywho, once formatted and installed, which only took ~10 minutes with my SSD, I re-upgraded to Windows 8.1 and began restoring my programs and data.

## It's Just Not My Day

Earlier, after returning from Novatech, my Android phone decided to take a turn for the worse, it started suffering from the infamous SD card cashing, where the phone instantly locks up when the SD card is inserted, but mysteriously springs back to live when its removed. It is believed this issue is as a result of a loose connection between the circuit board and SD reader. The phone is a [Samsung Galaxy Ace](http://www.samsung.com/uk/consumer/mobile-devices/smartphones/android/GT-S5830OKAXEU), which is only about 2 months old, I purchased it in early September replacing my old work phone, a [Samsung Galaxy Young](http://www.samsung.com/uk/consumer/mobile-devices/smartphones/android/GT-S5360MAAXEU), which had taken a beating from my time doing road works. This is the exact same problem it suffered from, but I wasn't surprised when I first looked up the issue and discovered it was caused by loose connections because the phone was in a pretty bad state, it had taken several drops, blows, subjected to all manner of dust and dirt and even dropped in concrete at one point. Without the SD card the phone loses quite a bit of functionality, its no longer able to save camera images, the amount of app space is severely limited to the point where it can't even handle the Facebook app. In-fact the only apps I have installed that weren't on the SD card are Google Authenticator and Kik.

## The Fatal Mistake

So I use 2-Step-Auth wherever its available, be that Facebook, GitHub, Google, Twitter, etc. Now theres different implementations of 2-Step-Auth, some use an SMS service like Microsoft, some use push notifications to their own apps like Twitter and Facebook, but most choose to use Googles open source [Authenticator](http://en.wikipedia.org/wiki/Google_Authenticator) app. Earlier I mentioned about my SD card issue and that the only apps I had installed on my phone was Google Authenticator and Kik, so I'm still able to access pretty much all of my online services, with the exception of one.

Now Facebook and Twitter both like to use their own app for 2-Step-Auth, but I don't have either installed on my phone, they were both on my SD card... Luckily Facebook offers all three of the previous methods, so I'm still able to log in to Facebook, but Twitter do things a little differently, rather than generating auth codes they send a notification to your phone asking you to approve or deny the log in attempt, of course I don't have said app installed. So there's a backup system like Facebook, right? Wrong, unless your with one of the select few mobile networks Twitter uses for SMS based backups, there is no backup solution.

Although this is my own fault for not generating any backup codes, unlike Facebook, Twitter haven't made this an easy process to recover from. I'm now awaiting a reply from Twitter support which they say could take "Several days"...
