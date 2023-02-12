---
title: "Enabling Swap on Ubuntu"
date: "2016-01-29"
excerpt: "Digital Ocean’s 512MB RAM instances are great for running a small website from, if you tighten up your configs you can actually get some pretty great performance from them, but sometimes that low amount of RAM can be an issue, particularly when you have a large amount of dependencies with npm and other such package managers."
---

Digital Ocean's 512MB RAM instances are great for running a small website from, if you tighten up your configs you can actually get some pretty great performance from them, but sometimes that low amount of RAM can be an issue, particularly when you have a large amount of dependencies with npm and other such package managers.

When your machine runs out of RAM, or OOMing (Out Of Memory-ing), it'll likely kill the process using most of the RAM, although it can pick at random processes to kill off if the RAM is still saturated, which could potentially leave you with vital services being offline. This is where swap comes in.

### What is swap?

It's a file on the disk that is used to store inactive or infrequently used data that would otherwise be stored in RAM, its also used as an overflow if there's no space in the RAM available. Swap is similar to the Windows pagefile, if you're familiar with it.

### Checking if you already have swap

Let's check if there's existing swap on our system, Digital Ocean droplets don't usually come preconfigured with swapas its often seen as bad to be using swap when you're running on an SSD. This is because swap utilises the disk and thus reduces the life span on the SSD, potentially causing problems not only for yourself but everyone on the same host machine.

```sh
sudo swapon -s

Filename                Type        Size    Used    Priority
```

If you've no entries come back, like the above, then you've not got an existing swap configured, and even if you do, you can have multiple swap files configured to give the system further swap available.

> It should be noted that if the general services installed on your system regularly utilise swap, you should think about upgrading the RAM available. This will greatly improve the performance of your system over the use of swap.

### Create a swap file

Here we're going to allocate a 1 gigabyte swap file, however you can use any size you think you need. Filesizes can be allocated by appending either `G` or `M`, representing gigabytes and megabytes respectivly.

```sh
sudo fallocate -l 1G /swapfile
```

We can then verify our file has been created and is ready for use.

```sh
ls -lh /swapfile

-rw-r--r-- 1 root root 1.0G Jan 10 09:41 /swapfile
```

The swap file should already have reserved the full size on the disk.

### Enabling the swap file

Currently we've just created our file and our system doesn't know that we want it to use it. We first need to change the permissions so that only the root user can read and write to the file, this avoids the file being written to and corrupted by other users on the system.

```sh
sudo chmod 600 /swapfile
```

We can verify the permissions as below

```sh
ls -lh /swapfile

-rw------- 1 root root 1.0G Jan 10 09:46 /swapfile
```

As you can see, now only the root user has permissions to read and write to the file. Now that our file is secure we can tell the system to use the file we've created.

```sh
sudo mkswap /swapfile
```

Setting up swapspace version 1, size = 1049000 KiB
no label, UUID=050e1e34-39e6-4072-a03e-ae0bf90ba13a

We can verify that the swap is now being used by using the `swapon` command again

```sh
sudo swapon -s

Filename                Type        Size    Used    Priority
/swapfile               file        1049000 0       -1
```

We've now setup the swap file and our system will start using it should it need.

### Making the swap file permenant

We have our swap file enabled now, however if we reboot the server, the swap file will not automatically be enabled again. We make the swap file permenant by editing our `/etc/fstab` file.

```sh
sudo vi /etc/fstab
```

At the bottom of a file add a new line with the following

```
/swapfile   none    swap    sw    0   0
```

Save the file and exit the editor, thats it! The swap file will now be automatically enabled when you reboot the system.
