---
date: "2017-11-24"
title: "Using Docker secrets with Laravel"
excerpt: "Docker secrets are a convenient and secure way of managing sensitive information that your containers need access to. More can be read on them over on the docker documentation. You may be tempted to set your config as environment variables when building your container, as The Twelve-Factor App encourages, but this isn’t secure when using docker containers"
---

Docker secrets are a convenient and secure way of managing sensitive information that your containers need access to. More can be read on them over on the docker [documentation](https://docs.docker.com/engine/swarm/secrets/).

![Using Docker secrets with Laravel](images/horizontal_large.png)

You may be tempted to set your config as environment variables when building your container, as [The Twelve-Factor App](https://12factor.net/config) encourages, but this isn't secure when using docker containers because the variables are published along with your image. If your image is public then anyone can read them, but even if it's private, let's try to keep any sensitive information out of our VCS

Secrets are mounted to your container as files in the `/run/secrets` directory. The filenames are the same as your secret name. If we created a secret called `db_password`, it would be mounted at `/run/secrets/db_password`. Reading them is as simple as reading the file, so PHP's `file_get_contents()` function comes in handy.

```php
function docker_secret(string $name): string
{
    return trim(file_get_contents('/run/secrets/' . $name));
}
```

### Using Docker secrets in the Laravel config

Accessing the secrets at runtime using the helper above is all well and fine, but if you use this helper in your config, you'll find that the secrets are being read as soon as its loaded. This will likely cause errors when you're developing locally because you don't have any secrets set up and probably use environment variables instead.

Luckily for us, Laravel passes all config items through the [value() helper](https://github.com/laravel/framework/blob/5.5/src/Illuminate/Support/helpers.php#L1143) which calls a closure if one is supplied. This means we can return a closure that calls the `docker_secret` helper.

```php
function docker_secret_callable(string $name): Closure
{
    return function () use ($name) {
        return docker_secret($name);
    };
}
```

Now we can use this in our config files and it will only attempt to read the secret when the environment variable is missing. Let's say we've stored our `app.key` config in a secret called `app_key`. We can use the helper to load the secret into our config like this

```php
'key' => env('APP_KEY', docker_secret_callable('app_key')),
```
