---
title: "Free HTTPS/SSL certificates with Let's Encrypt"
date: "2016-01-08"
excerpt: "Back in October 2015 Let’s Encrypt received cross-signatures from IdenTrust, which means their certificates are now trusted by all major browsers. They entered a closed beta period, and in December they extended their beta to the public, which means SSL certificates are completely free and automated, for everyone. Let’s get started creating and installing a certificate."
---

Back in October 2015 Let's Encrypt received cross-signatures from IdenTrust, which means their certificates are now trusted by all major browsers. They entered a closed beta period, and in December they extended their beta to the public, which means SSL certificates are completely free and automated, for everyone.

Let's get started creating and installing a certificate. The process is so painless, you'll be up and running within 15 minutes.

### Installing

First things first, we need to install the Let's Encrypt client. You can do this on any machine and transfer the certificates via. SFTP, but its much easier to install the client on the server you want to use the certificates with.

```sh
git clone https://github.com/letsencrypt/letsencrypt
```

That's it, we're all installed and ready to go, kind of. The first time you use  Let's Encrypt it will install all of its dependencies.

### Obtaining a certificate

To generate ourselves a certificate its a simple as

```sh
./letsencrypt-auto certonly --standalone -d example.com -d www.example.com
```

It does require us to stop our webserver temporarily to verify that we control the domain, but there is an alternative which will place a file in the existing webroot to provide verification without the need to stop our webserver.

```sh
./letsencrypt-auto certonly --webroot -w /var/www/webroot -d example.com -d www.example.com
```

Using this method will place a HTML file in our webroot for Let's Encrypt to be able to verify we have control of the domain. This of this much like the old-school way of verifying Google Analytics, except its completely automated for us.

### Where are the certificate files and what are they?

Now we've generated the certificate you'll find the files under `/etc/letsencrypt/live/example.com`. You should have the following files. `cert.pem`, `chain.pem`, `fullchain.pem`, and `privkey.pem`.

If you're familiar with SSL certificates then the above should all be self-explanatory, but I'll quickly run through them for those that aren't.

`cert.pem` is the public certificate for your domain.

`chain.pem` contains several public certificates from Let's Encrypt and their signing authorities that have signed your certificate. This chain file is also known as a bundle.

`fullchain.pem` contains both the contents of `cert.pem` and `chain.pem`. This is the file we'll be using to setup our SSL with the webserver. The reason for this is that not all browsers know who Let's Encrypt are, but by providing the "chain" of certificates that have signed our own certificate the browser can use this to verify our certificate is trusted.

`privkey.pem` contains our private key certificate which is used to encrypt and decrypt communications in conjunction with our public certificate. You should never expose this file to anyone, if you do all communications should be considered insecure.

### Using the certificate

Using the certificate couldn't be easier as Let's Encrypt has done most of the work for us by chaining all the vendor certificates together for us. Not all SSL providers do this for us.

All we need to do is edit our vhost file and tell it to start listening via. SSL and where our SSL certificates live.

```
server {
    [...]

    listen 443 ssl;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem

    [...]
}
```

The last thing to do is simply reload our webserver configuration.

```sh
service nginx reload
```

You should now be able to access https://example.com/ and successfully establish a secure connection.

### Renewing certificates

Let's Encrypt certificates are short lived, lasting only 90 days, but the process to renew is painless and can also be automated. They say currently they are working on a better way of automating the renewal process, but hell, this way is a million times better than the existing system for renewing traditional certificates and its free!

To renew a certificate we simply use the same command we used to generate the certificate initially.

```sh
./letsencrypt-auto certonly --webroot -w /var/www/webroot -d example.com -d www.example.com
```

To automate it simply pop it on a crontab to repeat at least once in the 90 day period. Now I'm not an expert on crontab and googling didn't yield the best of results, but I'm currently using this on my cron.

```sh
0 0 01 */2 * /path/to/letsencrypt/letsencrypt-auto certonly --webroot -w /var/www/webroot -d example.com -d www.example.com
```

This runs the renewal every 2 months on the 1st of the month at midnight.

### Wrapping up

Let's Encrypt have greatly modernised the whole process of obtaining an SSL certificate, completely automated the process, and given the user control over their own certificates. They've still a lot more on the roadmap for the future so we'll see what goodies that brings.
