## PostMessage

#### Importing and Instantiation
  
```typescript
import { PostMessage } from 'app/classes';

let msg = new PostMessage();
let msg = new PostMessage({cmd: 'goCrazy'});
let msg = new PostMessage({cmd: 'changeColor', body: 'red'});
let msg = new PostMessage({id: '123', cmd: 'response', body: 'fooBarBaz'});
```

#### Sending Message

In order to send a PostMessage, you will need a window/frame object.

```typescript
let frame = window.open('http://someframe.com');
let msg = new PostMessage({cmd: 'doSomething'});
msg.sendTo(frame);
```

#### Getting Responses

Register a function to handle the response to your message. The response handler is unregistered
immediately upon receiving a response.

```typescript
let frame = window.open('http://someframe.com');
let msg = new PostMessage({cmd: 'getData'});
msg.sendTo(frame).onResponse((resp, msgObj) => {
    // resp is the body from the msgObj (any type).
    // msgObj contains a bit more information if you want it.
        // msgObj:
        //  id: string
        //  cmd: string
        //  body: any
})
```

If you'd like to unregistered the listener after a set timeout, you can specify it like this:

```typescript
msg.sendTo(frame).onResponse((resp, msgObj) => {
    // this will wait 1 second before timing out and unregistering
}, 1000);
```

If you'd like to unregister the listener at a time of your choosing:

```typescript
let unregister = msg.sendTo(frame).onResponse((resp, msgObj) => {
    // this message will wait indefinitely for the response.
});

// do some things, decide you can stop waiting for that response
unregister();
```

#### Changing Current Window Context

When unit testing you may want to replace the window with your own object.

```typescript
let msg = new PostMessage();

let windowMock = {
    addEventListener: () => {},
    removeEventListener: () => {}
};

msg.setContext(windowMock);
```

