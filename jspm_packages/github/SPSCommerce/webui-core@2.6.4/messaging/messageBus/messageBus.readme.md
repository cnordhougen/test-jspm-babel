## messageBus

| First Available 	| Last Updated  | Lifecycle     | Files |
|-----------------	|----------     |----------     |------ |
| v2.6.0 	        | v2.6.0        | Stable        | [messaging/messageBus][messageBus] 	|

This service provides a 1:1 messaging channel between window.self and window.parent (Commerce Platform).

#### Sending Messages

```javascript
// Send a message with no data
messageBus.send('customMessage');

// Send a message with arbitrary data
messageBus.send('customMessage', {some: 'data'});

```

#### Getting a Response to a Message

```javascript
messageBus.send('getSomething').onResponse(function(response) {
    console.log(response); // "something"
});
```

#### Reacting to Broadcast Messages

```javascript
messageBus.on('doSomething', function(response) {
    console.log(response);
});
```

#### Responding to Broadcast Messages

```javascript
// Respond with a literal and it will be sent as it is.
messageBus.on('getSomething').repondWith('something');

// Respond with a function and the return val is sent.
messageBus.on('getSomething').respondWith(function() {
    return 'some' + 'thing';
});

// Respond with a function that returns a Promise.
messageBus.on('getSomething').respondWith(function() {
    return new Promise(function(resolve) {
        resolve('some' + 'thing');
    });
});

// Respond with a Promise.
messageBus.on('getSomething').respondWith(new Promise(function(resolve) {
    resolve('some' + 'thing');
}));
```

[messageBus]: https://github.com/SPSCommerce/webui-core/blob/master/core/messaging/messageBus
