---
date: "2023-11-22"
title: "Improve Performance When Querying Apple Health Samples in Shortcuts"
excerpt: "My [home page](/) has a couple of sections which display my health and activity data. This is powered by a Shortcut that runs on my iPhone every day at 9am. I query data from Apple Health, and then trigger a deploy via GitHub actions.

This was working fairly well until I started exercising a lot more during the summer months. The Shortcut was taking longer and longer to run, and eventually started hitting many problems. Over time, it got very slow, sometimes running from 9am and still going into the afternoon. This was destroying my phone's battery and making the device very hot for long periods. Eventually it ended up throwing an error most days."
---

My [home page](/) has a couple of sections which display my health and activity data. This is powered by a Shortcut that runs on my iPhone every day at 9am. I query data from Apple Health, and then trigger a deploy via GitHub actions.

This was working fairly well until I started exercising a lot more during the summer months. The Shortcut was taking longer and longer to run, and eventually started hitting many problems. Over time, it got very slow, sometimes running from 9am and still going into the afternoon. This was destroying my phone's battery and making the device very hot for long periods. Eventually it ended up throwing an error most days.

I had tried a few things when originally building the shortcut, but given it run in about 10 minutes back then, I never put that much effort into it. My assumption was just that there were so many samples being queried, it was just taking a long time to return any data. But so long as it run once in a while, I was happy, so I moved on from the problem.

My shortcut is broken down into several individual ones to gather each peice of data, then the main shortcut pipes this data to my website. The general format for each of the shortcuts is to gather samples over the last 30 days and then sum the result. (e.g Get steps in the last 30 days, get distance cycled in the last 30 days, etc)

Earlier this month, a conversation started in the office, prompted by [Robb](https://rknight.me) knowing several people who offer services for optimising shortcuts. I mentioned my issue, and we briefly had a look into what my shortcut was doing when it was running. My assumption about the query for health samples taking a long time was very wrong, this finished within a few seconds. Oddly the time consuming part was summing the samples.

![Apple shortcut demonstrating that summing many Apple Health samples takes a long time](shortcut-unoptimized.webp)

This is because samples are snapshots of activity within a small timeframe. A single day could see hundreds of samples added. So looping over these samples to sum them understandably takes time.

The fix to this is simple, reduce the amount of results coming from the Apple Health query. To do this you can group results, I chose to group this by day, reducing my results to 30. This improved the performance dramatically, and is now under 5 seconds

![Apple shortcut demonstrating that reducing the amount of results from a query improves performance](shortcut-optimized.webp)

Now collecting my health data and deploying my site takes under 1 minute. My phone's battery is much happier, and I can deploy my site whenever I want.