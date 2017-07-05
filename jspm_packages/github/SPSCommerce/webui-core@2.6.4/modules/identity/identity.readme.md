## identityService

| First Available 	| Lifecycle     | Files |
|-----------------	|----------     |------ |
| v2.3.0 	        | Stable           | [modules/identity][identityService] 	|

This service provides access to the SPS Identity Service API, with environment auto-detection
(when run inside Commerce Platform), and automatic user token header injection via the
[tokenService](http://localhost:8000/#services-tokenservice).

#### Environment Auto-Detection

When your app is run inside the Commerce Platform iframe, it is passed a user access token that
was generated from a specific Identity environment. This module automatically detects which Identity
environment to use based upon the current Commerce Platform environment.

| Env | Commerce Platform URL | Identity URL |
| --- | --------------------- | ------------ |
| dev | https://dev.commerce.spscommerce.com | https://dev.id.spsc.io/identity/ |
| test | https://test.commerce.spscommerce.com | https://test.id.spsc.io/identity/ |
| stage | https://stage.commerce.spscommerce.com | https://stage.id.spsc.io/identity/ |
| prod | https://commerce.spscommerce.com | https://id.spsc.io/identity/ |

#### Setting Environment Manually

You may want to manually set the Identity environment you are using (such as when developing locally).
To do this use the ```identityServiceProvider``` during the config phase of your app bootstrap.

```javascript
angular.module('yourApp')
  .config(function (identityServiceProvider) {

    // Env options: dev | test | stage | prod
    identityServiceProvider.setEnv('test');

    // You can also specify an absolute URL if needed.
    identityServiceProvider.setUrl('https://local.identity/');
  });
```

#### HTTP Methods

The ```identityService``` contains methods for making HTTP calls to the API.  These methods are
identical to the default ```$http``` methods, with the added bonus of knowing which Identity env
to use and automatic inclusion of the user access token Authorization header.

* ```identityService.get(path, config);```
* ```identityService.delete(path, config);```
* ```identityService.head(path, config);```
* ```identityService.patch(path, data, config);```
* ```identityService.post(path, data, config);```
* ```identityService.put(path, data, config);```

#### Usage

```javascript
MyController.$inject = ['identityService'];

function MyController(identityService) {

    // You can also set the environment during the run phase.
    identityService.setEnv('prod');

    // GET request to: https://id.spsc.io/identity/users/
    identityService.get('users').then(function(response){
        console.log(response.data);
    });

    // POST request to: https://id.spsc.io/identity/users/bulk/
    identityService.post('users/bulk', {foo: 'bar'}).then(function(response){
        console.log(reseponse.data);
    });
}
```

---

[identityService]: https://github.com/SPSCommerce/webui-core/tree/master/core/modules/identity/
