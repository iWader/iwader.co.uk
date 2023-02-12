---
title: "Updating PATH environment variable (OSX and Unix systems)"
date: "2015-01-11"
excerpt: "The PATH environment variable is used to store locations where executable files are found so that when we run a command its actually mapped to the executable on your filesystem. (i.e: running vi will alias to /usr/bin/vi) You can find out the true path of an executable by using which (i.e: which vi will output"
---

The PATH environment variable is used to store locations where executable files are found so that when we run a command its actually mapped to the executable on your filesystem. (i.e: running `vi` will alias to /usr/bin/vi)

> You can find out the true path of an executable by using `which ` (i.e: `which vi` will output `/usr/bin/vi`)

To extend our PATH variable we first need to edit our `.bash_profile` file found in the home folder.

```sh
vi ~/.bash_profile
```

in this file we need to add the following

```sh
export PATH=/path/to/new/bin:/path/to/another/bin:$PATH
```

`export` indicates we want the variable to be available outside of our `.bash_profile` script and available to the entire system. We then assign the PATH variable our new path, separating paths with the `:` character, after which we then append the existing $PATH variable.

Now we can save our file, but we still cannot use executables in our newly assigned locations until we either logout and back in, or alternativly we can reload the environment using the `source` command

```sh
source ~/.bash_profile
```

## Adding composer to PATH variable

To add the composer global to our PATH variable we can use the above method and add the following.

```sh
export PATH=~/.composer/vendor/bin:$PATH
```

and after saving the file run the following

```sh
source ~/.bash_profile
```

You can now access globally installed composer packages, for example `laravel/homestead`
