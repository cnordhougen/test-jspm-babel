## currentUser

| First Available 	| Last Updated  | Lifecycle     | Files |
|-----------------	|----------     |----------     |------ |
| v2.1.0 	        | v2.6.0        | Stable        | [services/currentUser][currentUser] 	|

This service provides details about the current logged in user.

#### Service Methods

The following methods are available on the ```currentUser``` service during the run phase.

**whenReady()**

> Waits until the user details are populated before resolving.

* Returns Promise
    * Resolved with user details object
    * Rejected if problem getting details
    
----

**whoami()**

> Make a fresh request to Identity to fetch the user details.

* Returns Promise
    * Resolved with user details object
    * Rejected if error during request

----

#### Usage

```javascript
MyController.$inject = ['currentUser'];

function MyController(currentUser) {

    // The user access token
    console.log(currentUser.token);

    // To get the user details, you must wait until they are populated
    currentUser.whenReady().then(function(details) {        
        console.log(details);
    });
}
```

#### User Details Object

```json
{
  "first_name": "Foo",
  "last_name": "Bar",
  "roles": [
    "comp:dev",
    "comp:user"
  ],
  "user_type": "Company Employee",
  "email": "fbar@company.com",
  "user_search": "fbar@company.com Foo Bar",
  "meta": {
    "owner": "aaa:org:use1-00000000-0000-0000-0000-000000000000",
    "created_by": "aaa:user:use1-00000000-0000-0000-0000-000000000000",
    "created": "2016-02-29T15:03:03.030303Z"
  },
  "identity_id": "12345678901234567890123456789012345678",
  "organization": {
    "organization_name": "Company",
    "organization_site": "www.company.com",
    "namespace": "comp",
    "id": "use1-00000000-0000-0000-0000-000000000000",
    "identity_id": "987654321098765432109876543210987654321"
  },
  "id": "use1-abcd1234-abc1-1234-a123-123abcde4567",
  "types": [
    "comp:obj",
    "comp:user"
  ],
  "job_title": "Foo Bar",
  "preferences": {
    "language": ["en-US"],
    "locale": "en-US",
    "timezone": "America/Chicago"
  }
}
```

---

[currentUser]: https://github.com/SPSCommerce/webui-core/tree/master/core/modules/currentUser/currentUser.service.js
