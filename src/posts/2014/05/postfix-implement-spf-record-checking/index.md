---
title: "Postfix Implement SPF Record Checking"
date: "2014-05-13"
excerpt: "So I’ve been dealing with quite a bit of spam recently, the usual “You’re due a tax rebate open XYZ.zip and fill out the form”, etc. Following from my last blog post, Postfix Force SMTP Authentication, I noticed I never set up my mail server to check received mail against the senders SPF records, which I always take the time to setup on domains"
---

So I've been dealing with quite a bit of spam recently, the usual "You're due a tax rebate open XYZ.zip and fill out the form", etc. Following from my last blog post, [Postfix Force SMTP Authentication](http://blog.iwader.co.uk/postfix-force-smtp-authentication/), I noticed I never set up my mail server to check received mail against the senders SPF records, which I always take the time to set up on domains, so why had I not taken the time to make sure my own mail server was taking advantage of SPF.

In this guide I'll cover configuring postfix to check SPF records under Debian 7 Wheezy

## What are SPF records?

Sender Policy Framework (SPF) records are a DNS record you apply to your domain to let other mail servers know emails originating from your mail server are legitimate and not spam.

As with real-world snail mail anyone can put a return address on an envelope, the same applies to email. SPF records provide a way of saying mail from example.com should only be accepted if they're from this server, or this cluster of servers and if they originate from another source, don't accept them.

## Installing the daemon

First things first we need to install the daemon that is going to check the SPF records for us. This comes as a postfix module we'll need to configure.

```sh
sudo apt-get install postfix-policyd-spf-perl
```

Next we need to locate the executable file, by default this is located at `/usr/sbin/postfix-policyd-spf-perl` however for other linux flavours this is likely located elsewhere.

To locate the executable we can use the following commands

```sh
updatedb
locate policyd-spf
```

Likely locations are `/usr/bin/`, `/usr/sbin/`, `/usr/local/bin/` etc. (The usual locations you'd find an executable at). Take note of the executable's location as we'll need it later.

## Configuring postfix

Next up we need to configure postfix to use the new daemon we've installed. Open `/etc/postfix/main.cf` with your favourite editor

```sh
vi /etc/postfix/main.cf
```

Add the following option at the bottom of the file

```
policy-spf_time_limit = 3600s
```

This changes the time out limit so the policy server won't time out while a message is still being processed.

After that we now need to edit `/etc/postfix/master.cf` to configure a new service for postfix to use.

```
policy-spf unix - n n - - spawn user=nobody argv=/usr/sbin/postfix-policyd-spf-perl
```

Change the `argv=` option accordingly with the location of the executable we installed previously.

Finally, we need to add the new policy service to our `smtpd_recipient_restrictions` option in `/etc/postfix/main.cf`

```
smtpd_recipient_restrictions = permit_sasl_authenticated, permit_mynetworks, reject_unauth_destination, check_policy_service unix:private/policy-spf
```

> Note: Put the policy server after `reject_unauth_destination` to prevent unexpected responses from the policy service and to prevent your system from becoming an open relay. You should also put the policy service after you permit local senders as we only want to check the SPF records of inbound mail from the internet, not outbound mail from you or your users.

The last thing to do is reload postfix

```sh
sudo /etc/init.d/postfix reload
```

## Verifying It's working

The simplest way to varify you've successfully installed and configured the SPF checking is to monitor your mail log whilst sending yourself an email from an external source such as Gmail.

```sh
tail -f /var/log/mail.log
```

If there is a problem with the policy service or its integration with Postfix it will be logged, likewise accepted mail that passes the SPF checking will also be logged.

```
May 13 18:23:51 postfix/policy-spf[5509]: Policy action=PREPEND Received-SPF: pass (gmail.com ... _spf.google.com: Sender is authorized to use '@gmail.com' in 'mfrom' identity (mechanism 'include:_netblocks.google.com' matched)) receiver=.iwader.co.uk; identity=mailfrom; envelope-from="@gmail.com"; helo=mail-qg0-f46.google.com; client-ip=
```
