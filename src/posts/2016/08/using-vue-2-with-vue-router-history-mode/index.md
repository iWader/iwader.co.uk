---
title: "Using Vue 2.0 with Vue-Router's history mode"
date: "2016-08-27"
excerpt: "I recently started a new side project and decided to start using Vue 2.0 seeing as it had now reached RC stage. Some plugins however aren’t quite at that point, and I found myself digging through a lot of source code to get things working. One of things I wanted to enable was yhe HTML pushstate, but the configuration options had changed and documentation has not yet been updated"
---

I recently started a new side project and decided to start using Vue 2.0 seeing as it had now reached RC stage. Some plugins however aren't quite at that point, and I found myself digging through a lot of source code to get things working.

One of things I wanted to enable was the HTML5 pushstate, but the configuration options had changed and documentation had not yet been updated. Instead of the router having several options to pass in on changing the use of the pushstate and hashbang in the URLs. In 2.0 the router now just has a single `mode` option which can accept the following options: `hashbang`, `history` or `abstract`. These have the exact same uses as before, but are now simpler to configure through the single option.

Heres a quick snippet on how to get that working

```js
import Vue from 'vue/dist/vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: {template: 'Hello World!'} }
    ]
})

export const app = new Vue({
    router
}).$mount('#app')
```
