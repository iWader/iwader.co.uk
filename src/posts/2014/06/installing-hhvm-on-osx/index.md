---
title: "Installing HHVM on OSX"
date: "2014-06-13"
excerpt: "Just a quick post on how to install HHVM on OSX Mavericks (Also works on Mountain Lion). I use HHVM locally to speed up composer. A great way to do that is to create a bash alias for composer."
---

Just a quick post on how to install HHVM on OSX Mavericks (Also works on Mountain Lion)

```sh
brew tap homebrew/dupes
brew tap homebrew/versions
brew tap mcuadros/homebrew-hhvm
brew install hhvm
```

I use HHVM locally to speed up composer. A great way to do that is to create a bash alias for composer. To do this, add the following to your `~/.bash_profile` file and run source `~/.bash_profile` to reload your aliases.

```sh
alias composer="hhvm /usr/local/bin/composer"
```

Now whenever you run `composer` in your terminal it will be run through HHVM.
