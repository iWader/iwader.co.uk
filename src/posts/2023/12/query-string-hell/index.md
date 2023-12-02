---
date: "2023-12-02"
title: "Query String Hell"
excerpt: We came across a bug at work related to query strings and how there’s basically no agreed way of handling complex structures, or anything beyond strings. I guess that's a given seeing as it's a query string
---

We came across a bug at work related to query strings and how there’s basically no agreed way of handling complex structures, or anything beyond strings. I guess that's a given seeing as it's a query _string_. The `x-www-form-urlencode` spec doesn't really cover duplicate keys, but the spec does state that query strings should be parsed as a list. Even so, it appears every corner of the internet has their own, very different, implementations

## Some context

Our api allows you to optionally embed entities in the request using the query string. `?embed=entity`. Fairly common on REST apis. If you want to embed multiple entities you’d use the following format `?embed[]=entity1&embed[]=entity2`. Again widespread across the internet

On several of our products that consume our api we use the [qs package](https://www.npmjs.com/package/qs) to build query strings from an object. This works by calling `qs.stringify({ foo: ‘bar’ })` which outputs `?foo=bar`. Given an array as one of the values `qs.stringify({ foo: [‘bar’, ‘baz’] })` you’d get `?foo[]=bar&foo[]=baz` so far, so good

On one of our products, we had decided to remove the [qs package](https://www.npmjs.com/package/qs), instead opting to use `URLSearchParams`, which is native to all modern JavaScript environments. Less packages, less bloat, less reliance on third-parties, so improvements all round

## The Problem

The bug in our product occurred on an endpoint on which we were requesting multiple embeds. `URLSearchParams` as expected follows the `x-www-form-urlencode` spec

As it turns out the array syntax our api supports in query strings seems to be a PHP flavour and not part of the aforementioned spec 🤦‍♂️

We quickly fixed this up with a hacky patch on the api as an immediate fix, and then set about fixing the consuming product and getting a release scheduled

## Internet Democracy

My colleague [@robb](https://rknight.me) tooted a poll and the internet democracy soon put us right. Along with PHP, there’s some suggestion Rails also supports the same query string syntax

<iframe src="https://social.lol/@robb/111459022753660684/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://social.lol/embed.js" async="async"></script>

As the poll shows, our api, and so PHP's behaviour is just wrong, and doesn't follow the spec. There’s also some very wild implementations for behaviors from Google Drive, and BitBucket

<iframe src="https://social.lol/@tekphloyd/111459214799220968/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://social.lol/embed.js" async="async"></script>

## Conclusion

Just because a behaviour is widespread across the internet, doesn’t mean it’s part of a spec, or that other languages will support the same thing. PHP powers over 70% of identifiable website infrastructure, but not following the spec has promoted a false sense of behavior

I've come across quite a few apis with odd query string behaviours over the years, and I just put it down to them using languages where web isn't their primary focus, but it turns out, they're just following the spec
