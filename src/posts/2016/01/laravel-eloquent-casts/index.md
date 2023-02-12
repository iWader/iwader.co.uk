---
title: "Laravel Eloquent Casts"
date: "2016-01-22"
excerpt: "Laravel’s Eloquent is a very powerful ORM however quite often in Laravel 4 I found myself creating accessors which simply cast the value to a specific type, rather than, in most cases just being a string out of the database."
---

Laravel's Eloquent is a very powerful ORM however quite often in Laravel 4 I found myself creating accessors which simply cast the value to a specific type, rather than, in most cases just being a string out of the database.

```php
class MyModel extends Eloquent
{
    public function getYearsAttribute($value)
    {
       return (int) $value;
    }
}
```

This was fine when using strict comparisons, but it quickly becomes tiring and unwieldy, filling your model with lots of functions which don't really do much.

As of Laravel 5 however, Eloquent contains a `$casts` property which can be used to automatically cast attributes from the database to a specific type, without the need to create your own accessors.

Simply add a `$casts` property to your model containing a `'key' => 'type'` structure.

```php
protected $casts = [
    'years' => 'int',
    'is_enabled' => 'bool',
];
```

Now when you access the `years` and `is_enabled` attributes of your model they'll automatically be cast to your configured types.

```php
var_dump($model->years);
int(2)

var_dump($model->is_enabled);
bool(true)
```
