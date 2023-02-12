---
title: "Bootstrap 4 Pagination With Laravel"
date: "2016-02-11"
excerpt: "As of version 5.2.14 Laravel has supported pagination with Bootstrap 4 (Currently Alpha 2). Here's how to use it, or indeed any custom pagination class you may have set up. Firstly create a new service provider php artisan make:provider PaginationServiceProvider In the register method we’ll pass a closure to Laravel’s paginator class that creates and returns"
---

As of version `5.2.14` Laravel has supported pagination with [Bootstrap 4](http://v4-alpha.getbootstrap.com/) (Currently Alpha 2). Here's how to use it, or indeed any custom pagination class you may have set  up.

Firstly create a new service provider

```sh
php artisan make:provider PaginationServiceProvider
````

In the `register` method we'll pass a [closure](http://php.net/manual/en/class.closure.php) to Laravel's paginator class that creates and returns the presenter we wish to use. In this example we're using the BootstrapFourPresenter which comes with Laravel >=5.2.14.

```php
namespace App\Providers;

use Illuminate\Pagination\BootstrapFourPresenter;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class PaginationServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        Paginator::presenter(function($paginator)
        {
            return new BootstrapFourPresenter($paginator);
        });
    }
}
```

Now all we need to do is add our new service provider into our `config/app.php` providers array.

```php
'providers' => [

    App\Providers\PaginationServiceProvider::class,

]
```

Now whenever we output pagination links they'll produce HTML for Bootstrap 4.
