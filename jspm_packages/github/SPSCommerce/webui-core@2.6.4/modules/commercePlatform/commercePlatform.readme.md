## commercePlatform

| First Available 	| Last Updated  | Lifecycle     | Files |
|-----------------	|----------     |----------     |------ |
| v2.3.0 	        | v2.6.0        | Stable        | [services/commercePlatform][commercePlatform] 	|

This service provides methods for working with the Commerce Platform parent window.

#### Provider Config Methods

The following methods are available on the ```commercePlatformProvider``` during the config phase.

**setEnvironment(string)**

> Tell commercePlatform service which environment to use.

* This bypasses the environment autodetection.
* No return value

----

**setDetectionTimeout(number)**

> Set the timeout for environment auto detection.

* If the parent window does not respond within this time, getEnvironment() calls will reject.
* No return value

----

#### Service Methods

The following methods are available on the ```commercePlatform``` service during the run phase.

**getAppURL()**

> Gets the current application URL from Commerce Platform.

* Returns Promise
    * Resolved with absolute URL, ex: ```https://commerce.spscommerce.com/fulfillment```
    * Rejected if Commerce Platform does not response.

----

**getEnvironment()**

> Gets the current environment from Commerce Platform.

* Returns Promise
    * Resolved with one of: ```dev | test | stage | prod | none```
    * Rejected if Commerce Platform does not respond.

----

**updateState()**

> Tell Commerce Platform about your application's current ui-router state.

* Sends postMessage with your current ```$location.path``` and ```$location.search```.
* No return value

----

**setPageTitle(title)** (added in v2.4.0)

> Update the Commerce Platform page title from your application. 

* ```setPageTitle('Foo Bar Baz')``` will result in "SPS YourAppName: Foo Bar Baz"
* ```setPageTitle(null)``` will reset page title to default "SPS YourAppName"
* No return value

----

**showSpinner()** (added in v2.6.0)

> Cover your application with a basic loading spinner

* No return value

----

**hideSpinner()** (added in v2.6.0)

> Remove the Commerce Platform loading spinner

* No return value

----

**showErrorPage(error)** (added in v2.6.0)

> Show a styled error page.

* Options are: 400, 403, 404, 500.
* No return value

----

#### Usage


```javascript
angular.module('myApp')
    .config(function(commercePlatformProvider) {
 
        commercePlatformProvider.setEnvironment('dev');        
        
    });
```

```javascript
MyController.$inject = ['commercePlatform'];

function MyController(commercePlatform) {

    // Example of using the getEnvironment() method

    commercePlatform.getEnvironment().then(function (env) {
        console.log('Commerce Platform Env', env);
    }).catch(function () {
        console.log('Unable to determine environment');
    });
    
    // Example of setting the page title    
    commercePlatform.setPageTitle('My Page Title');
        
    // Reset page title back to default
    commercePlatform.setPageTitle(null);
    
}
```

---

[commercePlatform]: https://github.com/SPSCommerce/webui-core/blob/master/core/modules/commercePlatform/commercePlatform.service.provider.js
