---
title: "Signing your git commits with your Keybase key"
date: "2016-09-06"
excerpt: "Keybase provides a convenient way to verify identities by signing things. One great use for this is signing your git commits and releases. To do this there's several steps we need to take: import your Keybase key into your local GPG keyring, configure git to sign commits using the key and finally add our GPG key to GitHub"
---

[Keybase](https://keybase.io) provides a convenient way to verify identities by signing things. One great use for this is signing your git commits and releases. To do this there's several steps we need to take: import your Keybase key into your local GPG keyring, configure git to sign commits using the key and finally add our GPG key to GitHub

## Importing your Keybase keys to your GPG keyring

The first thing we need to do is import your Keybase keys into your local GPG keyring. We can do this quite simply using the keybase cli tool.

```sh
keybase pgp export | gpg --import
keybase pgp export --secret | gpg --allow-secret-key-import --import
```

Verifying this has worked correctly can be done by running `gpg --list-secret-keys` and it will output your current GPG keys, which should look something like this

```sh
# /Users/wade/.gnupg/secring.gpg
# ------------------------------
# sec   4096R/8A8FCFB2 2016-08-18
# uid                  Wade Urry <wade@iwader.co.uk>
```

## Set up Git to sign your commits

Next we should configure git to sign your commits using the GPG key you just imported. You'll need to identify part of the output from `gpg --list-secret-keys`.

```sh
git config --global user.signingkey 8A8FCFB2
git config --global commit.gpgsign true
```

## Add your GPG key to GitHub

Finally, we just need to add your GPG key to GitHub. The settings for GPG keys on GitHub can be found at [https://github.com/settings/keys](https://github.com/settings/keys)

Copy your GPG key using the command below and add a new key to GitHub

```sh
keybase pgp export | pbcopy
```

## Checking things have worked

If you want to verify things have worked create a new commit and push it up to GitHub. If you then view the commit history of your repo you should then see a nice green "Verified" symbol.

![github-verified-commit](images/github-verified-commit.png)
