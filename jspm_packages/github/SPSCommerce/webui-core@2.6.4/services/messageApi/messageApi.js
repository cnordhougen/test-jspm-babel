var MessageApi = {

    _inboundMessages: [],

    _receiveMessage: function (event) {
        //TODO we should also only accept messages from certain origins as well
        if (typeof event.data.match === 'function' && event.data.match(/^RUBICON_/)) {
            var message = JSON.parse(event.data.replace(/^RUBICON_/, ''));
            var type = message.type;
            // Check defined inbound message for one with the matching type.
            // If found, trigger all subscribers of that message.
            for (var i = 0; i < MessageApi._inboundMessages.length; i++) {
                if (MessageApi._inboundMessages[i]._type === type) {
                    MessageApi._inboundMessages[i]._dispatch();
                    break;
                }
            }
        }
    },

    _sendMessage: function (message) {
        if (window !== parent) { // only send messages if running in a frame
            // stringify message because IE9- don't support sending objects
            // prefix message so we can only consume messages we care about
            parent.postMessage('RUBICON_' + JSON.stringify(message), '*'); //TODO: figure out what to do with targetOrigin
            return true;
        } else {
            return false;
        }
    },

    _currentURL: location.href,

    _updateParentURL: function () {
        if (location.href !== MessageApi._currentURL) {
            MessageApi._sendMessage({
                type: 'updateAppURL',
                params: {
                    url: location.href
                }
            });
            MessageApi._currentURL = location.href;
        }
        setTimeout(MessageApi._updateParentURL, 1000);
    },

    _iframeSizingDiv: null,
    _ensureIFrameSizingDiv: function () {
        if (document.body.lastChild !== MessageApi._iframeSizingDiv) {
            if (MessageApi._iframeSizingDiv === null) {
                MessageApi._iframeSizingDiv = document.createElement('div');
                MessageApi._iframeSizingDiv.setAttribute('style', 'display:block; visibility:hidden; height:0; margin:0; padding:0; border:0; clear:both');
            } else {
                document.body.removeChild(MessageApi._iframeSizingDiv);
            }
            document.body.appendChild(MessageApi._iframeSizingDiv);
        }
    },

    _currentHeight: null,
    _updateIFrameHeight: function () {
        MessageApi._ensureIFrameSizingDiv();
        var height = Math.ceil(MessageApi._iframeSizingDiv.getBoundingClientRect().top);
        if (height !== MessageApi._currentHeight) {
            MessageApi._sendMessage({
                type: 'setAppFrameHeight',
                params: {
                    height: height
                }
            });
            MessageApi._currentHeight = height;
        }
    },

    _initIFrameResize: function () {
        // Code mostly borrowed from https://github.com/davidjbradshaw/iframe-resizer

        function addEventListener(el, evt, func) {
            if ('addEventListener' in window) {
                el.addEventListener(evt, func, false);
            } else if ('attachEvent' in window) { //IE
                el.attachEvent('on' + evt, func);
            }
        }

        function setupInjectElementLoadListners(mutations) {
            function addLoadListener(element) {
                if (element.height === undefined || 0 === element.height) {
                    addEventListener(element, 'load', function imageLoaded() {
                        MessageApi._updateIFrameHeight();
                    });
                }
            }

            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    addLoadListener(mutation.target);
                } else if (mutation.type === 'childList') {
                    var images = mutation.target.querySelectorAll('img');
                    Array.prototype.forEach.call(images, function (image) {
                        addLoadListener(image);
                    });
                }
            });
        }

        function initWindowResizeListener() {
            addEventListener(window, 'resize', function () {
                MessageApi._updateIFrameHeight();
            });
        }

        function initWindowClickListener() {
            addEventListener(window, 'click', function () {
                MessageApi._updateIFrameHeight();
            });
        }

        function setupMutationObserver() {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            function createMutationObserver() {
                var
                    target = document.querySelector('body'),

                    config = {
                        attributes: true,
                        attributeOldValue: false,
                        characterData: true,
                        characterDataOldValue: false,
                        childList: true,
                        subtree: true
                    },

                    observer = new MutationObserver(function (mutations) {
                        MessageApi._updateIFrameHeight();
                        setupInjectElementLoadListners(mutations); //Deal with WebKit asyncing image loading when tags are injected into the page
                    });

                observer.observe(target, config);
            }

            if (MutationObserver) {
                createMutationObserver();
            }
            else {
                initInterval();
            }
        }

        function initInterval() {
            setInterval(MessageApi._updateIFrameHeight, 1000);
        }

        initWindowResizeListener();
        initWindowClickListener();
        setupMutationObserver();
    }
};


MessageApi._InboundMessage = function (type) {
    this._type = type;
    this._subscribers = [];
    MessageApi._inboundMessages.push(this);
};
MessageApi._InboundMessage.prototype._findSubscriber = function (subscriber) {
    for (var i = 0; i < this._subscribers.length; i++) {
        if (this._subscribers[i] === subscriber) {
            return i;
        }
    }
    return -1;
};
MessageApi._InboundMessage.prototype.subscribe = function (subscriber) {
    if (typeof subscriber === 'function' && this._findSubscriber(subscriber) < 0) {
        this._subscribers.push(subscriber);
    }
};
MessageApi._InboundMessage.prototype.unsubscribe = function (subscriber) {
    var index = this._findSubscriber(subscriber);
    if (index >= 0) {
        this._subscribers.splice(index, 1);
    }
};
MessageApi._InboundMessage.prototype._dispatch = function () {
    for (var i = 0; i < this._subscribers.length; i++) {
        this._subscribers[i]();
    }
};

window.addEventListener('message', MessageApi._receiveMessage, false);

window.onload = function () {
    MessageApi._updateParentURL();
    MessageApi._initIFrameResize();
};

// MESSAGE DEFINITIONS

/* Inbound Messages
 * ----------------
 *
 * Define a new inbound message with the following:
 *   MessageApi.<message_name> = new MessageApi._InboundMessage(<message_type>)
 *
 * The client page can attach a callback to the message with
 * message_name.subscribe().  The callback will be triggered
 * whenever the page receives a message of type message_type.
 *
 *
 * example:
 *   Define message below with this:
 *     MessageApi.testMessage = new MessageApi._InboundMessage('test');
 *
 *   Client usage:
 *     callback = function();
 *     testMessage.subscribe(callback);
 *
 *   Result:
 *     callback() executed when server sends message of {type: 'test'}
 */


/* Outbound Messages
 *
 * Define an outbound message as a function which creates a
 * message object and sends it using MessageApi._sendMessage()
 *
 * See messageAPI Angular factory for usage of outbound messages.
 *
 * Example:
 *  MessageApi.sendTestMessage = function(param_1, param_2) {
 *      var message = {
 *          type: 'test',
 *          params: {
 *              param1: param_1,
 *              param2: param_2
 *          }
 *      }
 *      MessageApi._sendMessage(message);
 *  }
 *
 */

// Opens a new MessageApi application window, with 'url' as the source instead of the default app url.
// For use in development, uses window.open() when MessageApi parent window is not present.
//   Parameters
// url: relative or absolute url to the desired page in your app, to be loaded in MessageApi
// title: Text to be displayed in the title bar of the window. If empty string or null, the app's default title will be used.
MessageApi.openNewAppWindow = function (url, title) {
    if (url === null) {
        url = '';
    }
    var a = document.createElement('a');
    a.href = url;
    var message = {
        type: 'newAppWindow',
        params: {
            url: a.href,
            title: title
        }
    };
    if (!MessageApi._sendMessage(message)) {
        console.log('MessageApi parent window not found. Opening normal window: ' + a.href);
        window.open(a.href);
    }
};

// Opens a modal window in MessageApi and loads the given url inside.  Only one modal may be open at once, and attempting
// to open additional modals before closing the first one will produce no result.  Call closeAppModal() to close an open modal.
// For use in development, uses window.open() when MessageApi parent window is not present.
//   Parameters
// url: relative or absolute url to the desired page in your app, to be loaded in a MessageApi modal over the current page
// title: Text to be displayed in the title bar of the modal. If empty string or null, the modal's title bar will be hidden.
// size: Defines relative width of the modal. Valid values are: tiny, small, medium, large, xlarge.  Defaults to medium.
// backdrop: Defines state of the modal's backdrop.
//           true: backdrop is shown.  clicking outside the modal will dismiss the modal
//           false: backdrop is not shown.  clicking outside the modal interacts with the page behind it
//           'static': backdrop is shown, and clicking outside the modal does not close it
MessageApi.openAppModal = function (url, title, size, backdrop) {
    if (url === null) {
        url = '';
    }
    if (backdrop === null) {
        backdrop = true;
    }
    var a = document.createElement('a');
    a.href = url;
    var message = {
        type: 'newAppModal',
        params: {
            url: a.href,
            title: title,
            size: size,
            backdrop: backdrop
        }
    };
    if (!MessageApi._sendMessage(message)) {
        console.error('MessageApi parent window not found. Opening window instead of modal:' + a.href);
        window.open(a.href);
    }
};

// Close the currently open app modal, if one is open.
MessageApi.closeAppModal = function () {
    var message = {
        type: 'closeAppModal'
    };
    if (!MessageApi._sendMessage(message)) {
        console.error('MessageApi parent window not found. No modal to close.');
    }
};

//  Set the height of the applications iframe
//  height: height in pixels of the frame
MessageApi.setAppFrameHeight = function (height) {
    var message = {
        type: 'setAppFrameHeight',
        params: {
            height: height
        }
    };
    MessageApi._sendMessage(message);
};

MessageApi.enterFullScreen = function () {
    console.warn('MessageApi.enterFullScreen() is deprecated, please remove all instances from your app.');
};

MessageApi.exitFullScreen = function () {
    console.warn('MessageApi.exitFullScreen() is deprecated, please remove all instances from your app.');
};

module.exports = MessageApi;
