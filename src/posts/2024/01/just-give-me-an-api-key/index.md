---
date: "2024-01-21"
title: "Just give me an API key"
excerpt: I've been working on adding a [now page](https://iwader.co.uk/now) to my site, which is largely automated pulling in data from Apple Health, Strava, and last.fm.
---

I've been working on adding a [now page](https://iwader.co.uk/now) to my site, which is largely automated pulling in data from Apple Health, Strava, and last.fm.

Using the Strava api was incredibly frustrating as they force you to use OAuth. I appreciate we use OAuth to be able to authenticate multiple user's against a single application, limit access to data through scopes, and frequently rotate tokens to prevent replay attacks, but in this case I only want to access my data.

What ever happened to service's providing a simple API key? I don't want to OAuth just because I want to run a single GET query on my own data.
