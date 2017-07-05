
var PostMessageMock = require('../postMessage/postMessage.mock');

var event = {
    handler: {},
    destroy: function() {},
    respondWith: function() {}
};

module.exports = {

    send: PostMessageMock.sendTo,

    allowOrigin: function(){},

    trigger: function(){},

    destroy: function(){},

    once: function() {
        return event;
    },

    on: function() {
        return event;
    }
};
