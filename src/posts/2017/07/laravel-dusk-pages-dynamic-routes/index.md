---
title: "Laravel Dusk pages with dynamic routes"
date: "2017-07-08"
excerpt: "Here's a quick demo to show how you can still use the Dusk pages with model specific routes. Lets say we have a CRM and you have a page that lets you view details of a single contact. The route might look something like http://my.crm/contacts/1 now you could manually navigate to that page, select some elements"
---

Here's a quick demo to show how you can still use the Dusk pages with model specific routes.

Let's say we have a CRM and you have a page that lets you view details of a single contact. The route might look something like `http://my.crm/contacts/1` now you could manually navigate to that page, select some elements and then add some assertions. But that could quickly become tedious if you have a lot of tests for that page, and especially if in the future you need to change the classes/ids of elements on the page.

For static routes (e.g where the route doesn't contain an id) you can easily utilise the pages to set the URL and elements for quick reuse in your tests. What if you could do the same with dynamic routes that change based upon the model?

All you need to do is pass in the models in the page's constructor and then you can reference the id in the URL and element selectors.

```php
class ContactDetailPage extends BasePage
{
    protected $contact;

    public function __construct(Contact $contact)
    {
        $this->contact = $contact;
    }

    public function url()
    {
        return '/contacts/' . $this->contact->getRouteKey();
    }

    public function elements()
    {
        return [
            '@detail' => '#contact-detail-' . $this->contact->id,
        ];
    }
}
```

Then in your tests you can use the page and elements as you normally would. The only difference is you need to pass your model into the page, `new ContactDetailPage(Contact::find(1))`.

```php
public function it_should_show_a_single_contact()
{
    $contact = factory(Contact::class)->create();

    $this->browse(function (Browser $browser) use ($contact) {
        $browse->visit(new ContactDetailPage($contact))
            ->waitFor('@detail')
            ->assertSee($contact->name);
    });
}
```
