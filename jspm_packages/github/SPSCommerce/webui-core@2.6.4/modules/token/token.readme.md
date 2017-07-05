## tokenService

| First Available 	| Lifecycle     | Screenshot    | Files |
|-----------------	|----------     |-----------    |------ |
| v2.3.0 	        | Stable        | n/a           | [modules/token][tokenModule] 	|

The tokenService captures the user access token from the URL and sets up an $http interceptor for
injecting the authorization header into HTTP requests.

#### Enable Auth Header for All HTTP Requests

By default HTTP requests will not have the user access token added in the appropriate Authorization
header as expected by various SPS services.  If you wish to have the auth header added to all
HTTP requests, you can enable it during the config phase using the ```tokenServiceProvider```.

```javascript
angular.module('yourApp')
  .config(function (tokenServiceProvider) {

    // true: automatically add the header to all http requests.
    // false (default): do not automatically add the header to http requests.

    tokenServiceProvider.injectAuthHeader(true);
  });
```

#### Enable/Disable Auth Header Per Request

If you would like to enable or disable the Authorization header for a single request, you can pass a
```useToken``` config option to the $http request method that will override the global setting.

```javascript
MyController.$inject = ['$http'];

function MyController($http) {

    // This request will always have the Authorization header
    $http.get('/some/api/', {useToken: true});

    // This request will never have the Authorization header
    $http.get('https://thirdparty.org/some/api/', {useToken: false});
}
```

---

[tokenModule]: https://github.com/SPSCommerce/webui-core/blob/master/core/modules/token
