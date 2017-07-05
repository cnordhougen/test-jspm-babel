## spsui-sidebar (deprecated)

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.0.0 	        | Deprecated        | [screenshot][sidebar-ss]           | [component/sidebar][sidebar] 	|

*Deprecation Warning: 2016 product designs for have removed the page title and sidebar elements.
New applications should not implement this component, instead use [spsui-page-nav](/#components-spsui-page-nav).
This component will be removed in WebUI-Core v3.0*

This component creates a sidebar navigation for web apps running inside Commerce Platform.
An array of navigation items can passed as a JSON file or a javascript object.

#### Requirements
The sidebar component must be a child of ```<spsui-application>```.

#### Usage

``` html
<spsui-application>
    <spsui-sidebar config-obj="sidebarConfig"></spsui-sidebar>
</spsui-application>
```

```
$scope.sidebarConfig = {
    title:{
        displayName: 'My Application',
        iconClass: 'fa fa-lg fa-globe'
    },
    items: [
       {
           id: 'dashboard',
           displayName: 'Dashboard',
           iconClass: 'fa fa-tachometer',
           routingState: 'dashboard'
       }, {
           id: 'companies',
           displayName: 'Companies',
           iconClass: 'fa fa-building',
           routingState: 'companies'
       }, {
           id: 'people',
           displayName: 'People',
           iconClass: 'fa fa-users',
           routingState: 'people'
       }, {
           id: 'applications',
           displayName: 'Applications',
           iconClass: 'fa fa-bullseye',
           routingState: 'applications'
       }
    ]
};
```

OR

``` html
<spsui-application>
    <spsui-sidebar config-path="/path/to/sidebar.json"></spsui-sidebar>
</spsui-application>
```


#### Attributes

| Attribute 	| Type 	    | Description 	                | Default 	|
|------------	|----------	|------------------------------ |---------	|
| config-obj 	| object 	| object with config options 	| - 	    |
| config-path 	| string 	| url location of JSON config  	| - 	    |

Use either ```config-obj``` or ```config-path```, not both.

When using a JSON config file, you cannot change the properties of your menu after initialization.  If you need to
programatically change your menu, use the ```config-obj``` attribute.

#### Icons

You can use any of the [Font Awesome icons](http://fontawesome.io/icons/) in your menu.

---

[sidebar]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/sidebar
[sidebar-ss]: https://cloud.githubusercontent.com/assets/44441/12057874/41e3ac46-af0b-11e5-9243-dabbf21696d8.png
