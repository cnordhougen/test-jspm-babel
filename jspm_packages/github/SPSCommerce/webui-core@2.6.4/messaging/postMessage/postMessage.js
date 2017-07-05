var uid = require('webui-core/utils/uid');

module.exports = PostMessage;

function PostMessage(opts) {

    var _this = this;

    this.id = opts.id || uid();
    this.cmd = opts.cmd || '';
    this.body = opts.body || '';
    this.legacy = opts.legacy || false;
    this.response = opts.response || '';

    var _window = window;

    /**
     * Change the window context that this PostMessage will be sent FROM.
     * This is necessary for being able to mock the window object during tests.
     *
     * Support legacy RUBICON_ messages from 2014-2016.
     * @TODO: Remove legacy support after sunset period.
     *
     * @param {} context
     */
    this.setContext = function(context) {
        _window = context;
    };

    this.sendTo = function(frame, origin) {

        origin = origin || '*';
        var msg = '';

        if (_this.legacy) {

            msg = 'RUBICON_' + JSON.stringify({
                type: _this.cmd,
                params: _this.body
            });

        } else {

            msg = JSON.stringify({
                id: _this.id,
                cmd: _this.cmd,
                body: _this.body,
                response: _this.response
            });
        }

        try {
            frame.postMessage(msg, origin);
        } catch(e) {
            console.error(e);
        }

        return {

            /**
             * Register a "fire-once" callback to catch this message response.
             *
             * @param {Function} callback
             * @param {Number} [timeout]
             * @returns {Function} unregister function
             */
            onResponse: function (callback, timeout) {

                timeout = timeout || -1;

                var timerId;
                var content;

                var listener = function(event) {
                    var isStr = (typeof event.data === 'string');
                    var isMine = (event.source === frame);

                    if (isStr && isMine) {
                        content = PostMessage.parse(event.data);
                        var isForMe = content.id === _this.id;
                        var isResponse = content.cmd === 'response';
                        if (isResponse && isForMe) {
                            callback(content.body, content);
                            removeListener();
                        }
                    }
                };

                var removeListener = function() {
                    _window.removeEventListener('message', listener);
                    clearTimeout(timerId);
                };

                if (timeout >= 0) {
                    timerId = setTimeout(removeListener, timeout);
                }

                _window.addEventListener('message', listener, false);

                return removeListener;
            }
        };
    };

}

/**
 * Parse content coming from a PostMessage, always return an obj,
 * event when the content is not valid JSON.
 *
 * Support legacy RUBICON_ messages from 2014-2016.
 * @TODO: Remove legacy support after sunset period.
 *
 * @param {String} str
 * @returns {IPostMessageContent}
 */
PostMessage.parse = function(str) {

    var legacy = false;

    if (str.substr(0, 8) === 'RUBICON_') {
        str = str.slice(8);
        legacy = true;
    }

    try {
        var msg = JSON.parse(str);
        if (legacy) {
            return {
                id: uid(),
                cmd: msg.type,
                body: msg.params,
                legacy: legacy
            };
        }
        return msg;
    } catch(e) {
        return {
            id: '',
            cmd: '',
            body: '',
            legacy: legacy
        };
    }
};
