## postMessage

| First Available 	| Lifecycle                    | Files |
|-----------------	|----------                    |------ |
| v2.1.0 	        | Stable, deprecated as of 2.6.0       | [services/postMessage][postMessage] 	|

*Deprecation Warning: This service has been deprecated and will be removed in webui-core v3.0.  
Please use the messageBus service in it's place.*

This service is meant to simplify the postMessage communication from application iframe to parent
Commerce Platform. This will eventually replace the wickedly old Rubicon messaging API.

#### Usage

```javascript
MyController.$inject = ['postMessage'];

function MyController(postMessage) {

    // Send a postMessage to Commerce Platform

    postMessage.sendToPlatform({
        type: 'messageType',
        params: {
            foo: 1,
            bar: 2,
            baz: 3
        }
    });

}
```

---

[postMessage]: https://github.com/SPSCommerce/webui-core/tree/master/core/services/postMessage/postMessage.js
