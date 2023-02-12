---
title: "How Composer Version Constraints Work"
date: "2016-02-05"
excerpt: "When using composer you’ve probably seen the 3 main operators used within the version contraints, wildcard *, tilde ~ and caret ^, each have their own uses and some which should be avoided if possible. Wildcard This is possibly the most commonly used constraint because it’s universally known. It is however a common cause of composer"
---

When using composer you've probably seen the 3 main operators used within the version constraints, wildcard `*`, tilde `~` and caret `^`, each have their own uses and some which should be avoided if possible.

### Wildcard

This is possibly the most commonly used constraint because it's universally known. It is however a common cause of composer being slow to resolve dependencies because it matches every version and doesn't reduce down the result set.

`1.*` for example matches `>=1.0.0` `<2.0.0`. That constraint could potentially be hundreds, if not thousands of version for composer to check compatbility with, making the process of resolving your dependencies slow and tiresome.

### Tilde

The tilde allows you to easily specify a minimum version to use whilst still allowing updates to minor and patch versions (If following [semver](http://semver.org/).). By specifying a minimum version we wish to use allows us to cut down the amount of versions composer has to check.

Using `~1.2` would match `>=1.2.0` `<2.0.0`. That allows us to cut away all the versions below `1.2.0` as we know we don't want those, it also allows us to be safe in the knowledge knowing that we'll recieve at least `1.2.0` which could contain a feature you're using that `1.1.x` doesn't.

If you want to lock your dependency to a minor version (e.g. you want only `1.4.x`) then you can specify the 3 [semver](http://semver.org/) digits in the version tag. `~1.4.3` will set the contraint as `>=1.4.3` `<1.5`

### Caret

The caret is fast becoming the most used constraint and is the recommended operator to use in the composer documentation. It behaves much like the tilde operator however follows [semver](http://semver.org/) much more closely.

`^1.2.3` would set the constraints of `>=1.2.3` `<2.0.0`, unlike the tidle operator it doesn't lock to minor versions, `~1.2.3` would allow `>=1.2.3` `<1.3`. `^1.2` would also yield in `>=1.2.0` `<2.0.0`.

It also has better behaviour for alpha (`<1.0` versions). `^0.4.2` for example would lock to `>=0.4.2` `<0.5`

### Testing Constraints

[madewithlove](http://madewithlove.be/) have kindly build a tool to check composer version constraints in real-time before actually installing your dependencies with composer. Check it out [semver.mwl.be](http://semver.mwl.be/)

### Conclusion

Going forward the tilde or caret operator should be your only option when installing dependencies, it helps greatly speedup your composer installs and allows you to stick closely to [semver](http://semver.org/).
