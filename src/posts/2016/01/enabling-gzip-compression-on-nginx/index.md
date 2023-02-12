---
title: "Enabling gzip compression on nginx"
date: "2016-01-15"
excerpt: "I’ve recently relaunched my site and as part of doing so spent quite a lot of time optimising the server and pages to make sure things load as quickly as possible, as Google has for some time been taking the page load speed into account when ranking results. Fortunately, the clever people at HTML5 Boilerplate have done much of the work for us"
---

I've recently relaunched my site and as part of doing so spent quite a lot of time optimising the server and pages to make sure things load as quickly as possible, as Google has for some time been taking the page load speed into account when ranking results.

Fortunately, the clever people at [HTML5 Boilerplate](https://html5boilerplate.com/) have done much of the work for us. The nginx configuration can be found [here](https://github.com/h5bp/server-configs-nginx/blob/master/nginx.conf#L70-L121).

Firstly edit your `nginx.conf` and locate the existing gzip settings.

```sh
vi /etc/nginx/nginx.conf
```

Remove the existing gzip settings and replace them with the [HTML5 Boilerplate config](https://github.com/h5bp/server-configs-nginx/blob/master/nginx.conf#L70-L121) we looked at earlier.

```
  # Compression

  # Enable Gzip compressed.
  gzip on;

  # Compression level (1-9).
  # 5 is a perfect compromise between size and cpu usage, offering about
  # 75% reduction for most ascii files (almost identical to level 9).
  gzip_comp_level    5;

  # Don't compress anything that's already small and unlikely to shrink much
  # if at all (the default is 20 bytes, which is bad as that usually leads to
  # larger files after gzipping).
  gzip_min_length    256;

  # Compress data even for clients that are connecting to us via proxies,
  # identified by the "Via" header (required for CloudFront).
  gzip_proxied       any;

  # Tell proxies to cache both the gzipped and regular version of a resource
  # whenever the client's Accept-Encoding capabilities header varies;
  # Avoids the issue where a non-gzip capable client (which is extremely rare
  # today) would display gibberish if their proxy gave them the gzipped version.
  gzip_vary          on;

  # Compress all output labeled with one of the following MIME-types.
  gzip_types
    application/atom+xml
    application/javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rss+xml
    application/vnd.geo+json
    application/vnd.ms-fontobject
    application/x-font-ttf
    application/x-web-app-manifest+json
    application/xhtml+xml
    application/xml
    font/opentype
    image/bmp
    image/svg+xml
    image/x-icon
    text/cache-manifest
    text/css
    text/plain
    text/vcard
    text/vnd.rim.location.xloc
    text/vtt
    text/x-component
    text/x-cross-domain-policy;
  # text/html is always compressed by HttpGzipModule
```

Lastly we just need to restart nginx and should be good to go.

```sh
service nginx restart
```

To confirm everything is running we can use cURL to check we recieve the correct headers to show gzip is available.

```sh
curl -I -H 'Accept-Encoding: gzip,deflate' https://example.com/
```

Hopefully you'll then receive a `Content-Encoding: gzip` header back, as below.

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
Vary: Accept-Encoding
Content-Encoding: gzip
```

You can also check using [Google's Page Speed](https://developers.google.com/speed/pagespeed/insights/), ensuring the "Enable Compression" check passes.
