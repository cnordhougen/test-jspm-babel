## spsui-page-nav

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.2.0 	        | New        | [screenshot][page-nav-ss]           | [components/page-nav][page-nav] 	|

This component provides a primary application navigation bar for your application.  It is a key
piece of the product navigation redesign started in 2016.

#### Requirements

The 2016 product designs call for applications to be visually centered. To center your application,
you need to toggle the application centered mode.

```html
<spsui-application mode="centered">
    <!-- the rest of your app -->
</spsui-application>
```

#### Usage

```javascript
function MyController() {

    this.items = [

        // name: Text that is displayed in the nav
        // state: UI-Router state to switch to on click
        // url: URL to load on click (for external links)

        {name: 'Overview', state: 'overview'},
        {name: 'Dashboard', state: 'dashboard'},
        {name: 'Favorites', state: 'favorites'},
        {name: 'Google', url: 'http://www.google.com'}
    ];
}
```

```html
<spsui-page-nav
    items="ctrl.items"
    title="My Application"
    title-state="dashboard"
    logo-image-url="images/app-icon.svg">
</spsui-page-nav>

<!-- To set all attributes from controller variables -->

<spsui-page-nav
    items="ctrl.items"
    title="{{ctrl.title}}"
    title-state="{{ctrl.tState}}"
    logo-image-url="{{ctrl.logo}}">
</spsui-page-nav>
```

#### Attributes

| Attribute 	 | Type 	| Required | Description 	                                | Default 	|
|--------------- |---------	|--------- | ------------------------	                    |---------	|
| items 	     | array 	| no       | array of item objects 	                        | - 	    |
| title 	     | string 	| no       | title of your application 	                    | - 	    |
| title-state    | string   | no       | ui-router state to go when title is clicked    | first item's state |
| logo-image-url | string   | no       | location of your app logo 	                    | - 	    |

#### Service

The page-nav component comes with a service for adding/removing nav items after initialization.

```javascript
MyController.$inject = ['pageNavService'];

function MyController(pageNavService) {

    // setItems() overrides all existing nav items.
    pageNavService.setItems([
        {name: 'First', state: 'one'},
        {name: 'Second', state: 'two'}
    ]);

    // addItem() pushes a new item onto the nav.
    pageNavService.addItem({name: 'Third', state: 'three'});

    // removeItem() pulls item by index or name.
    // both lines below remove the same nav item.
    pageNavService.removeItem(2); // zero indexed.
    pageNavService.removeItem('Third');

    // items is an array of the current nav items.
    console.log(pageNavService.items);
}
```

---

[page-nav]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/page-nav
[page-nav-ss]: https://cloud.githubusercontent.com/assets/44441/13995133/e48bfc60-f0f5-11e5-81ef-741e2d5aeb5f.png
