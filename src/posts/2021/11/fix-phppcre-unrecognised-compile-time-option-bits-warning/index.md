---
date: "2021-11-19"
title: "How to fix PHP/PCRE unrecognised compile-time option bit(s) warning"
excerpt: "We started to see the following warnings after upgrading to PHP 8.0.13. Despite only being warnings they cause the regex to fail and your application will probably error. preg_match(): Compilation failed: unrecognised compile-time option bit(s) at offset 0 preg_replace(): Compilation failed: unrecognised compile-time option bit(s) at offset 0 PHP 8.1-rc5 and 8.0.13 includes a patch for a performance"
---

We started to see the following warnings after upgrading to PHP 8.0.13. Despite only being warnings they cause the regex to fail and your application will probably error.

```sh
preg_match(): Compilation failed: unrecognised compile-time option bit(s) at offset 0

preg_replace(): Compilation failed: unrecognised compile-time option bit(s) at offset 0
```

PHP 8.1-rc5 and 8.0.13 includes a patch for a [performance regression](https://github.com/php/php-src/pull/7484) with PCRE functions, which caused a [bug](https://github.com/php/php-src/pull/7573), and the fix requires a newer version of PCRE2 than we had installed on our system.

The solution is thankfully straightforward, upgrade your PCRE2 packages. For Ubuntu you can run this command, thanks to [spideyfusion](https://github.com/oerdnj/deb.sury.org/issues/1674#issuecomment-964284447)

```sh
sudo apt-get install --only-upgrade libpcre2-16-0 libpcre2-32-0 libpcre2-8-0 libpcre2-dev libpcre2-posix2
```
