var destroy = require('webui-core/utils/destroy');
var EventHandler = require('webui-core/utils/eventHandler');
var PostMessage = require('webui-core/messaging/postMessage/postMessage');

window.sps = window.sps || {};
window.sps.MessageBus = module.exports = MessageBus;

function MessageBus(frame, self) {

    var _this = this;
    var _allowedOrigin = '*';

    this.frame = frame;
    this.handlers = {};
    this.self = self || window;

    this.self.addEventListener('message', messageHandler, false);

    /**
     * Private handler for the Post Messages coming to this window.
     *
     * @param {MessageEvent} event
     */
    function messageHandler(event) {
        var isStr = (typeof event.data === 'string');
        var isMine = (event.source === _this.frame);
        if (isStr && isMine) {
            var msg = PostMessage.parse(event.data);
            _this.trigger(msg.cmd, msg);
        }
    }

    /**
     * Whitelist messages from a specific origin.
     *
     * @param {String} origin
     */
    this.allowOrigin = function(origin) {
        _allowedOrigin = origin;
    };

    /**
     * Send a PostMessage to the frame.
     *
     * @param {String} cmd
     * @param {Any} body
     * @param {IPostMessageOptions} [opts]
     * @returns {IPostMessageSent}
     */
    this.send = function(cmd, body, opts) {
        body = body || '';
        opts = opts || {};
        opts.cmd = cmd;
        opts.body = body;
        var msg = new PostMessage(opts);
        return msg.sendTo(_this.frame, _allowedOrigin);
    };

    /**
     * Trigger all of the callbacks for a given command.
     *
     * @param {String} cmd
     * @param {IPostMessageOptions} [opts]
     */
    this.trigger = function(cmd, opts) {
        var handler = _this.handlers[cmd];
        if (handler) { handler.trigger(opts.body, opts); }
    };

    /**
     * Destroy all event handlers (remove their callbacks) and remove the "global"
     * window listener for post messages. This instance will no longer receive any
     * messages or trigger any events after this.
     */
    this.destroy = function() {
        try {
            _this.self.removeEventListener('message', messageHandler);
            destroy(_this.handlers);
            destroy(_this);
        } catch (e) {
            // Swallowing errors during destruction, usually just IE complaining
            // about something or other. No big deal, keep calm and carry on.
        }
    };

    /**
     * Create an EventHandler for a given command.  You can register an optional
     * callback function that will be fired when a message is received with the
     * given command. The returned event object contains utilities to handle the
     * incoming messages.
     *
     * var event = bus.on('foo').respondWith('bar');
     *
     * @param {String} cmd
     * @param {Function} [callbackFn]
     * @returns {IOnMessageEvent}
     */
    this.on = function(cmd, callbackFn) {

        var unregisterFns = [];
        var handler = _this.handlers[cmd] || new EventHandler();
        _this.handlers[cmd] = handler;

        if (callbackFn) {
            unregisterFns.push(handler.register(callbackFn));
        }

        var destroy = function() {
            _this.handlers[cmd].destroy();
            unregisterFns.forEach(function(unregister) {
                unregister();
            });
            return event;
        };

        var respondWith = function(response) {

            var unregister = handler.register(function (body, incomingMsg) {

                var result;
                var message;

                // Start building the response PostMessage content.
                // Notice the outgoing message id is the same as the
                // incomingMsg id and the body is 'response'. This is
                // what it takes to send a response message.

                var content = {
                    legacy: incomingMsg.legacy,
                    response: incomingMsg.cmd,
                    id: incomingMsg.id,
                    cmd: 'response',
                    body: ''
                };

                if (typeof response === 'function') {
                    result = response(body, incomingMsg);
                } else {
                    result = response;
                }

                if (result && result.then) {

                    // Result of the response handler is a promise,
                    // so when the promise resolves, send off the
                    // response PostMessage to the frame.

                    result.then(function (answer) {
                        content.body = answer;
                        message = new PostMessage(content);
                        message.sendTo(_this.frame);
                    });

                } else {

                    // Result of the response handler is not a promise
                    // so send the result of the function as the body
                    // of the PostMessage.

                    content.body = result;
                    message = new PostMessage(content);
                    message.sendTo(_this.frame, _allowedOrigin);
                }

            });

            unregisterFns.push(unregister);
            return event;
        };

        /**
         * Define the event object that is returned from on() and it's
         * chainable methods destroy() and respondWith().
         */
        var event = {
            handler: handler,
            destroy: destroy,
            respondWith: respondWith
        };

        return event;
    };

    this.once = function (cmd, callbackFn) {
        var event = _this.on(cmd, function() {
            callbackFn.apply(_this, arguments);
            event.destroy();
        });
        return event;
    };
}
