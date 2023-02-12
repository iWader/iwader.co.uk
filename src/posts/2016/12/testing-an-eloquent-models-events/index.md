---
title: "Testing an Eloquent model's events"
date: "2016-12-29"
excerpt: "I recently ran into an issue when attempting to test a trait that registered events on an Eloquent model. After I done a little digging it turns out that events on the model are only fired when the event dispatcher is set. Of course the events dispatcher is part of a different package (illuminate/events) and isn't setup when working with individual illuminate components"
---

I recently ran into an issue when attempting to test a trait that registered events on an Eloquent model. After I had done a little digging it turns out that events on the model are only fired when the event dispatcher is set. Of course the events dispatcher is part of a different package (`illuminate/events`) and isn't setup when working with individual illuminate components.

To get around this you simply need to install `illuminate/events` and give the dispatcher instance to Eloquent.

```php
Eloquent::setEventDispatcher(new \Illuminate\Events\Dispatcher());
```

A full working example can be found on the [laratools/laratools](https://github.com/laratools/laratools/blob/master/tests/phpunit/Eloquent/UuidTest.php#L20) repo
