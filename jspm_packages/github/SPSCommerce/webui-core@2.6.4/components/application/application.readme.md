## spsui-application

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.0.0 	        | Stable        | n/a           | [component/application][application] 	|

This component is the uppermost component used by applications running inside the Commerce Platform.
It provides a set of consistent wrappers to support the use of off-canvas menus without much fuss.

#### Usage

The 2016 product designs call for applications to be visually centered. To center your application,
you need to toggle the application centered mode.

```html
<body>
    <spsui-application mode="centered">
        <!-- your application goes here -->
    <spsui-application>
</body>
```

#### Attributes

| Attribute 	| Type 	| Description 	| Default 	|
|------------	|----------	|------------------------------------	|---------	|
| mode 	| string 	| "centered" centers contents of your app 	| - 	|

---

[application]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/application
