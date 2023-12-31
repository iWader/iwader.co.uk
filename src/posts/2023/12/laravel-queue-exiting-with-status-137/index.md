---
date: "2023-12-12"
title: "Laravel Queue Exiting with Status 137"
excerpt: We recently had a problem with our Laravel queue workers. We kept finding a particular queue job kept silently failing, not always, but often enough to cause us a significant headache. We weren't getting any of the usual logs or exceptions we'd expect with a potential timeout, memory issue, etc. We resorted to add some debug logging in production, profiling our memory usage, etc. but nothing was helping us get to the bottom of the issue. Eventually, I found something useful in the supervisor logs `exit status 137; not expected`.
---

We recently had a problem with our Laravel queue workers. We kept finding a particular queue job kept silently failing, not always, but often enough to cause us a significant headache.

We weren't getting any of the usual logs or exceptions we'd expect with a potential timeout, memory issue, etc. We resorted to adding some debug logging in production, profiling our memory usage, etc. but nothing was helping us get to the bottom of the issue.

Eventually, I found something useful in the supervisor logs `exit status 137; not expected`. Immediately I jump to it being an OOM issue, which was my suspicion, but we'd already been profiling and monitoring our usage. Nothing unexpected there, always below 100mb being used, and our limit was 128mb, the default for Laravel queue workers. Also, nothing in the syslog, or kern.log to suggest the OOM killer had been invoked.

Digging through the Laravel internals to check how the `--memory` flag works, I found that gives an exit code of 12 when the limit is exceeded. So not that. Back to square one we set about refactoring the job to try and reduce the memory usage, now we're under 60mb, but still, the issue persists.

We use SQS for our queue, so we have to manually extend the job visibility timeout, otherwise SQS will release the job back to another worker. So when the job did fail we'd see the expected 15 minutes delay before another worker picked up the job again. This threw us off the scent of it being a timeout issue. Usually for a timeout issue we'd expect to see the job be retried almost immediately by another worker.

Cutting to the chase we had set `private int $timeout = 60 * 15;` in the job class. This meant our manual SQS visibility timeout extension worked as expected, but Laravel couldn't read the timeout when it was serializing the object onto the queue. So when the job was picked up by a worker it would time out after the default 60 seconds and receive SIGKILL from the pcntl extension. This is what was causing the exit code 137.

The fix was to set the `$timeout` property to be public, `public int $timeout = 60 * 15;` so that Laravel can serialize the data onto the queue correctly.

This was compounded by the fact that PHP has some unexpected behaviour when accessing private properties of a class. If you use the null coalescing operator `??` when accessing a private property it will always evaluate to null and fallback. Usually if you access a private property you'd get an error.

None of this explains why we weren't seeing the expected timeout or max attempts exceeded exceptions, but we got to the bottom of the issue. Hopefully, this helps someone else out there.
