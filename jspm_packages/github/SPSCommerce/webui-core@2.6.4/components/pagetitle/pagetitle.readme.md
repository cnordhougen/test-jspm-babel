## spsui-page-title (deprecated)

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.0.0 	        | Deprecated    | [screenshot][pagetitle-ss]  | [component/pagetitle][pagetitle] 	|

*Deprecation Warning: 2016 product designs for have removed the page title and sidebar elements.
New applications should not implement this component, instead use [spsui-page-nav](/#components-spsui-page-nav).
This component will be removed in WebUI-Core v3.0*

This component renders a responsive page title into your app. It works in conjunction with ```spsui-sidebar```
and has some configurable features.

#### Usage

```javascript
function MyController() {

    this.title = 'Home';
    this.showBack = true;

    this.menuClick = function () {
        console.log('menu clicked');
    }

    this.backClick = function() {
        console.log('back clicked');
    }

}
```

```html
<spsui-page-title
    page-title="ctrl.title"
    show-back="ctrl.showBack"
    menu-click="ctrl.menuClick"
    back-click="ctrl.backClick">
</spsui-page-title>
```


#### Attributes

| Attribute 	| Type 	| Description 	| Default 	|
|------------	|----------	|------------------------------------	|---------	|
| page-title 	| string 	| title to display in the component 	| - 	|
| show-back 	| boolean 	| whether to display the back button 	| false 	|
| menu-click 	| function 	| fired when menu button is clicked 	| - 	|
| back-click 	| function 	| fired when back button is clicked 	| -     |

---

[pagetitle]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/pagetitle
[pagetitle-ss]: https://cloud.githubusercontent.com/assets/44441/12056500/aab14954-aefc-11e5-94e6-48506bd6a590.png
