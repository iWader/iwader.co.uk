---
title: "Laravel and non-composer-ised libraries"
date: "2013-12-14"
excerpt: "Composer has changed the way PHP is used, distributed and shared. It provides a way to easily manage dependencies and keep them up-to-date through the main package provider, Packagist, where anyone can register their package free, for everyone to access, but this is still a relatively new concept for PHP, so what if the package you want to use isn't available through packagist?"
---

Composer has changed the way PHP is used, distributed and shared. It provides a way to easily manage dependencies and keep them up-to-date through the main package provider, [Packagist](https://packagist.org/), where anyone can register their package free, for everyone to access, but this is still a relatively new concept for PHP, so what if the package you want to use isn't available through packagist?

There are a few ways you can go about adding non-composer-ised packages, both methods assume the package you want to use is object-orientated, but hey object-orientated methods have been around for over 50 years, so I'd hope we're finally there.

## Repositories

Composer can fetch dependencies from pretty-much anywhere, be it a git repo, svn, hg, pear package or even a zip file. If its hosted on the internet composer can probably manage it.

> Update: Using this method requires the repository to contain a valid composer.json file. If the repository you want to use does not contain a valid composer.json file you can use the Packages method found below

Using the example below we'll add zizaco/confide to our composer.json. Although this package is available through Packagist I'm just using this as a example.

```json
{
  "repositories": [
    {
      "name": "some-vendor/package",
      "type": "git",
      "url": "https://github.com/Zizaco/confide.git"
    }
  ]
}
```

You can then add `"some-vendor/package"` to the require section of your composer.json, as you would with any other package. Composer will then work its magic, keeping this package up-to-date every time you `composer update`. This repo will be treated just like every other composer dependency and will stored in your `vendor` directory.

Check out the documentation [here](http://getcomposer.org/doc/04-schema.md#repositories).

## Autoloading

But what if the package you want to use isn't available through a repo or you simply want to use one of your own libraries without bothering to setup a packagist repo for it, Simple!

Create a directory for your libraries, `app/libraries` is one often used with Laravel, but can be anything you like. Move your code into this directory and configure your composer.json as shown below.

```json
{
  "autoload": {
    "classmap": [
      "app/libraries/YourLibrary.php"
    ]
  }
}
```

Alternatively if your library is comprised of many classes you can just supply a directory to the classmap, `app/libraries/package`. Composer will then automagically load all of your classes ready for you to use throughout your application.

Having some issues? Drop a comment bellow and I'll reply asap.

## Update

A recent update to composer means using repositories requires a valid composer.json file to be located in the file store, so what if the repository you want to use doesn't contain a composer.json?

```json
"repositories": [
  {
    "type": "package",
    "package": {
      "name": "nnnick/Chartjs",
      "version": "dev-master",
      "source": {
        "type": "git",
        "url": "https://github.com/nnnick/Chart.js.git",
        "reference": "origin/master"
      }
    }
  }
]
```
