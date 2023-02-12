---
title: "Postfix Force SMTP Authentication"
date: "2014-05-08"
excerpt: "Recently I’ve been hit with some spam to my mailbox, the usual type “You’ve missed XYZ delivery please open the attached zip file”, etc. so I set up some spam filters to reject the mail, however they didn't seem to take effect, after a week or so the amount of emails increased exponentially, up to around 50 emails a day"
---

Recently I've been hit with some spam to my mailbox, the usual type "You've missed XYZ delivery please open the attached zip file", etc. so I set up some spam filters to reject the mail, however they didn't seem to take effect, after a week or so the amount of emails increased exponentially, up to around 50 emails a day.

When I took a closer look at the mail and inspected the headers I noticed the mail was being sent from my own server, which I thought was odd as the server required authentication to send mail, but what I didn't know was that the required authentication was to send mail to external sources. Mail that was addressed to any domains my server was handling would still be delivered. To combat the issue I needed to enable SASL on my server.

## SASL

Simple Authentication and Security Layer is a framework that can be used by many connection protocols for securing data, servers and users. With SASL enabled, Postfix will not accept any income SMTP connections without proper authentication.

I use Postfix and Dovecot so as such I'll be writing this guide taylored towards those.

## Configure Dovecot

Firstly we need to add a new listener under the dovecot auth service.

```sh
vi /etc/dovecot/conf.d/10-master.conf
```

```
unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
}
```

The above creates the unix socket to be used by Postfix at \`/var/spool/postfix/private/auth\` with permissions of 0660 for the postfix user and group.

Next we need to configure dovecot to allow postfix to use a new auth mechanism

```sh
vi /etc/dovecot/conf.d/10-auth.conf
```

```
auth_mechanisms = plain login
```

Finally, we need to restart the dovecot service for the changes to take effect.

```sh
service dovecot restart
```

## Configure Postfix

Now we need to configure postfix to use dovecot as the SASL service. Your configuration may already contain some of these directives, edit them as necessary or add them if they don't already exist.

```sh
vi /etc/postfix/main.cf
```

```
# SASL type
 smtpd_sasl_type = dovecot

# Path the to SASL socket relative to /var/spool/postfix
 smtpd_sasl_path = private/auth

# Domain to append to login name that do not already have a domain.
 # (i.e: If I was to use the username "wader" postfix would automatically append my domain to the end of the string so the username becomes "wader@iwader.co.uk")
 smtpd_sasl_local_domain = iwader.co.uk

# SASL default policy
 smtpd_sasl_security_options = noanonymous

# Support legacy compatibility
 broken_sasl_auth_clients = yes

# Enable SMTP auth
 smtpd_sasl_auth_enable = yes

# SMTP checks
 # checks are based on first match, sequence is important
 smtpd_recipient_restrictions = premit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
```

Full configuration options are available on the [postfix readme](http://www.postfix.org/SASL_README.html)

Now that we've configured postfix's SASL settings, we need to configure its SSL/TLS settings.

```sh
vi /etc/postfix/main.cf
```

```
smtpd_tls_security_level = may

smtpd_tls_received_header = yes

smtpd_tls_auth_only = no

# loglevel 3 or 4 can be used for debugging purposes
smtpd_tls_loglevel = 1

# Path to certificate and key files
smtpd_tls_cert_file = /etc/postfix/smtpd.cert
smtpd_tls_key_file = /etc/postfix/smtpd.key
smtpd_use_tld = yes

# Should the server announce it allows STARTTLS?
smtpd_tls_note_starttls_offer = yes

smtpd_tls_session_cache_timeout = 3600s
```

That's it, now we just need to restart postfix for the changes to take effect.

```sh
service postfix restart
```

Now we've stopped that pesky spam mail from being send via. our server.
