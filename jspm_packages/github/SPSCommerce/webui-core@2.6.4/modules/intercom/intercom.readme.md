## Intercom Module

| First Available 	| Last Updated  | Lifecycle     | Screenshot                | Files |
|-----------------	|----------     |----------     |-----------                |------ |
| v2.3.0 	        | v2.6.1        | Stable           | [screenshot][intercom-ss] | [modules/intercom][intercomModule] 	|

The Intercom Module configures and installs the [Intercom Messenger](https://www.intercom.io/messenger) into your application.

> Note: In order to run the Intercom Messenger, your application will need to be
> passed a valid user access token. This is easily achieved by launching your app
> from Commerce Platform. If you are running your app outside of Commerce Platform,
> you will need to manually pass the access token into your app.

#### How To Import

This module is not imported automatically into your app with WebUI-Core. If you choose to use it,
you need to set the Intercom Module as a dependency in your application.

**JSPM + SystemJS**

app.js

```javascript
require('webui-core');
require('webui-core/modules/intercom');

module.exports = angular.module('myApp', ['webui-core', 'webui-intercom']);
```

**Bower**

app.js

```javascript
angular.module('myApp', ['webui-core', 'webui-intercom']);
```

index.html

```html
<head>
    <!-- webui-core and module scripts -->
    <script src="/bower_components/webui-core/dist/webui-core.min.js"></script>
    <script src="/bower_components/webui-core/dist/webui-intercom.min.js"></script>
</head>
```
#### Configuration

You must set the Intercom application ID during the config phase of your application.

> Note: Your Intercom application ID is available in the Intercom dashboard after
> your app has been added to Intercom. Your product manager should be able to provide
> you with your Intercom application ID.

```javascript
angular.module('myApp')
    .config(function(intercomServiceProvider){

        intercomServiceProvider.config({app_id: 'YOUR_INTERCOM_APP_ID'});

        // Promise resolved when Intercom library is loaded and ready to use.
        intercomServiceProvider.whenReady().then(function (intercomService){});
    });
```

#### Usage

If your app is passed a valid user access token and you've correctly configured the
Intercom app ID, the Messenger will load and you should find a [blue button][intercom-ss-button]
in the bottom right corner of your application.

For more advanced controls, the ```intercomService``` is available. Please see the [Intercom Messenger API Documentation](https://docs.intercom.io/configuring-for-your-product-or-site/the-intercom-javascript-api)
for a complete list of available Intercom methods and events.

```javascript
MyController.$inject = ['intercomService'];

function MyController(intercomService) {

    // Show the Messenger window
    intercomService.api('show');

    // Hide the Messenger window
    intercomService.api('hide');

    // Callback when messenger window is opened
    intercomService.api('onShow', function(){});

    // Callback when messenger window is closed
    intercomService.api('onHide', function(){});

    // Promise resolved when Intercom library is ready
    intercomService.whenReady().then(function(){});
}

```


---

[intercomModule]: https://github.com/SPSCommerce/webui-core/blob/master/core/modules/intercom
[intercom-ss]: https://cloud.githubusercontent.com/assets/44441/14051267/9352a79a-f28f-11e5-9767-d0cb2b29743f.png
[intercom-ss-button]: https://cloud.githubusercontent.com/assets/44441/14052468/869f279a-f298-11e5-897a-2dd66c307e4f.png
