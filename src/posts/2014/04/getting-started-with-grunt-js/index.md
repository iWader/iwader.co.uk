---
title: "Getting started with Grunt.js"
date: "2014-04-19"
excerpt: "What is Grunt? Grunt is a task-runner for your website’s assets, but what does that mean? Simply put you can run a set of tasks on your website’s assets, automagically, without the hassle of setting up a range of different pieces of software and programs. Grunt neatly pulls together a range of different 'plugins' to manage your your assets with ease"
---

## What is Grunt?

Grunt is a task-runner for your website's assets, but what does that mean? Simply put you can run a set of tasks on your website's assets, automagically, without the hassle of setting up a range of different pieces of software and programs.

Grunt neatly pulls together a range of different 'plugins' to manage your assets with ease, ranging from simple css/js minifiers, less and coffeescript compilers to image optimisation. The best part is it's completely free.

## Getting Started

To get started using Grunt the first thing we need to do is install [Node.js](http://nodejs.org/ "Node.js") and the [Node Package Manager](https://www.npmjs.org/ "Node Package Manager (NPM)"). Not going to go into detail here as its relatively straight-forward.

Once we've installed Node and NPM we need to install the `grunt-cli` package, this is available through NPM. Simply run `npm install -g grunt-cli`.

The `-g` flag means we want to install the package globally to the system, rather than locally as part of our project. This gives us access to Grunt through the terminal.

> You may need to use sudo if you run into permission errors.

So now we have Grunt installed, but we can't really do anything with it yet as we need to write a configuration file, known as the `Gruntfile`, to let Grunt know what tasks we want it to run against what assets we have. We wouldn't want to run a less compiler on our javascript files, that would be silly.

## The Gruntfile

The `Gruntfile` is a simple configuration file written in Node, but don't worry it can be as basic or as complex as you need it to be and if you can understand json then it should be extremely simple to pickup.

Create a file called `Gruntfile.js` in your project's root directory. It's initial contents should look something like this...

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/bca8a4b8fc4ff9f7e24451536649c74dbc41bd1c.js?file=Gruntfile.js"></script>

So now we have our initial `Gruntfile` we need to define some tasks for Grunt to run on our assets. To do this we simply add to the JSON that is passed to the `grunt.initConfig()` function.

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/d8c91e5d2440fb4dd86dbd45bd9616dfa7a4e3ad.js?file=Gruntfile.js"></script>

So here we've defined that for the `less` task we want to create a file at `public/assets/css/app.min.css` that contains the compiled less from our `public/assets/less/app.less` file. We could define multiple `.less` files to compile into our `app.min.css`, or indeed multiple css files of which we have many `.less` files we compile into.

For example, we might choose to compile bootstrap separately from our own applications css.

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/41940bec3fd5a478febb2f803bcd9eb23dce87fb.js?file=Gruntfile.js"></script>

By setting the `compress` option to true we also minify our css when the less is compiled. For a full list of options checkout the `grunt-contrib-less` [README](https://github.com/gruntjs/grunt-contrib-less/blob/master/README.md "grunt-contrib-less README file").

## Running Grunt

At this point if we was to run Grunt we'd get an error stating that either a `Gruntfile` wasn't found or Grunt hasn't been installed locally to your project. Now obviously we have our `Gruntfile` created, but we don't have Grunt installed locally to our project. Remember earlier we installed the `grunt-cli` package using the `-g` flag to install Grunt globally, this was so we have access to the `grunt` command in our terminal.

Seeing as everything related to Grunt is handled through the NPM we're going to create a node package. Now this is pretty awesome because not only does it allows you to easily manage the dependencies you need for Grunt, it'll also allow you to use the same versions of the dependencies as the rest of your team, so you won't run into any odd bugs or issues that could be a result of running different versions.

To create our package all we need to do it create a `package.json` file in our project's root. Again this is a very simple configuration file to let NPM know what dependencies we want to install and let Grunt use. It should look something like this...

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/02f29dc310bda3c860af0318af816ef5cdf6270a.js?file=package.json"></script>

Notice under our `devDependencies` we have `grunt-contrib-less`, all Grunt plugins are NPM packages so if we want to use a certain plugin we must remember to install it as part of our package. A full list of all Grunt plugins can be found on the Grunt [site](http://gruntjs.com/plugins "Grunt plugins list").

Now we've created our `package.json` we need to actually install the dependencies, to do this we can run `npm install` from inside our project's root.

But still even if we was to run Grunt at this point we'd still not get anywhere because although we've configured what tasks should do what, we still need to load the NPM packages as well as define what tasks to run under different commands.

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/b5e6dde17ced44ba45f02b473790f311807ebcf5.js?file=Gruntfile.js"></script>

So for each of the tasks we want Grunt to run, we need to load the NPM package using the `grunt.loadNpmTasks()` function.

Under that we've defined what tasks we want Grunt to run by default, this is useful as we could provide several commands to do different things.

So now if we run `grunt` in the terminal it should be happy and compile our less into the `public/assets/css/app.min.css` file ready to use on our website.

## Grunt commands

As mentioned in the last paragraph we can define multiple commands under which we can tell Grunt to run different tasks, for example in a development environment we might be constantly changing our assets and need to quickly compile the new changes on the fly.

By default Grunt will compile our less files every time we run `grunt` in the terminal but this would get repetitive and time consuming if we was to compile all our assets every time we made a 1 line change to our less.

So what if we would make Grunt "watch" our assets and re-compile them automagically when it detects a change has happened, well thats exactly what the `grunt-contrib-watch` package does.

Firstly we need to add the `grunt-contrib-watch` package to our `package.json` and install it. To do this we just add the package under our `devDependencies` key and run `npm update` to install the new package we've added.

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/2ca524dadc951be25ac40ccdea9083720d2951aa.js?file=package.json"></script>

Next we then need to configure Grunt to use the new package.

<script src="https://gist.github.com/iWader/f7168ce0a7183fd2ad45/2ca524dadc951be25ac40ccdea9083720d2951aa.js?file=Gruntfile.js"></script>

So here we've loaded the new NPM package and registered a new `dev` command with Grunt under which we'll run the `watch` task.

Under the `grunt.initConfig()` command we've also added a new `watch:` key. Here we've told the `watch` command that for our less it should watch the files under `public/assets/less/*.less` and `public/assets/less/vendor/bootstrap/*.less`, when it detects a change to those files it should then run the `less` task.

So now instead of running `grunt` to compile our assets once, in a development environment where we're constantly changing our assets we can run `grunt dev` and Grunt will constantly watch our assets for any changes and run the defined tasks on-the-fly.

And to exit, as with any terminal program you can use `CTRL + C` to kill the program.

## Wrapping Up

Grunt is super awesome for managing your websites assets. Here we only covered how to get Grunt compiling our less files, but theres so much more it can do, just to mention a few, jshint/jslint, coffeescript, image optimisation even manage your require.js modules.

Take a look at some of the plugins Grunt has to offer [here](http://gruntjs.com/plugins "Grunt plugins").

A git repo of this post can be found [here](https://github.com/iWader/grunt-example).
