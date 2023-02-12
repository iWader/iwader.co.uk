---
title: "Using HTTP/2 Server Push"
date: "2016-09-07"
excerpt: "Firstly, what is server push? HTTP/2 is a great advancement for the HTTP protocol, allowing multiple assets to be streamed over a single TCP connection. This reduces the need for “optimisation practices” such as domain sharding, image sprites, etc. There is one really cool feature of HTTP/2 however which can greatly speed up the render time of your website"
---

## Firstly, what is server push?

HTTP/2 is a great advancement for the HTTP protocol, allowing multiple assets to be streamed over a single TCP connection. This reduces the need for "optimisation practices" such as domain sharding, image sprites, etc. There is one really cool feature of HTTP/2 however which can greatly speed up the render time of your website, and that is server push. Server push allows you to send your assets along with the HTML payload before the browser even knows it needs those assets.

## A quick scenario

Let's say a user visits a page on your site that has 3 images in its content. With HTTP/1 the browser would wait for the HTML payload and start parsing it, picking up images along the way, and then requesting them separately as and when it finds them. Using server push with HTTP/2, you can add a header to your HTML response that tells the browser, "Oh also, you'll need these assets too". It works for all assets too, images, fonts, javascript, CSS, etc.

## What do I need to do?

Getting server push working is relatively simple, you just need to add a Link header to your response. One for each asset you want to push. This is what I use on my site

```html
link: <https://iwader.co.uk/app/themes/iwader/build/assets/css/app-814bfa638f.css>; rel=preload; as=style
link: <https://iwader.co.uk/app/themes/iwader/build/assets/js/app-9982f65668.js>; rel=preload; as=script
```

You simply need to include the URL to your asset, the rel attribute with a value of "preload" and finally, what type of asset it is (e.g: style, font, script, image). Of course you can take it to a much finer degree of optimisation, but even pushing just the major css and js assets gives a great improvement on the load times.

## PHP example

```php
header('Link', '<https://example.com/path/to/my/asset.css>; rel=preload; as=style');
```
