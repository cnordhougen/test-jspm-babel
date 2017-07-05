
module.exports = PostMessageService;

PostMessageService.$inject = [
    '$log',
    '$window',
    '$rootScope'
];

/**
 * Service to simplify the communication from iframe app to parent
 * Commerce Platform. This will eventually replace the wickedly old
 * Rubicon messaging API.
 *
 * @param $window
 * @param $rootScope
 * @constructor
 */
function PostMessageService ($log, $window, $rootScope) {

    var _this = this;

    $window.addEventListener('message', _receiveMessage, false);

    /**
     * Send a postMessage payload to a specific target. If the target
     * cannot send postMessages, return false.
     *
     * @param {window} target
     * @param {object} message
     * @returns {boolean}
     */
    this.sendMessage = function (target, message) {
        if (typeof target.postMessage !== 'function') { return false; }
        target.postMessage('RUBICON_' + JSON.stringify(message), '*');
    };

    /**
     * Send a postMessage payload specifically to Commerce Platform.
     *
     * @param {object} message
     */
    this.sendToPlatform = function(message) {
        _this.sendMessage(parent, message);
    };

    /**
     * Send a postMessage payload specifically to an application iframe.
     *
     * @param {object} message
     */
    this.sendToIframe = function(message) {

        var iframe = document.getElementById('sps-app-iframe');

        if (!iframe) {
            $log.warn('Unable to send message', message, 'cannot find app iframe');
            return;
        }

        if (!iframe.contentWindow) {
            $log.warn('Unable to send message', message, 'app iframe has no window object');
            return;
        }

        _this.sendMessage(iframe.contentWindow, message);
    };

    /**
     * Parse incoming postMessages, ensure they are destined for our
     * consumption, and if formatted correctly, broadcast a $rootScope
     * event based upon the message type and data.
     *
     * @param event
     * @private
     */
    function _receiveMessage(event) {
        if (typeof event.data.match === 'function' && event.data.match(/^RUBICON_/)) {
            var message = JSON.parse(event.data.replace(/^RUBICON_/, ''));
            if ('type' in message) {
                var params = {};
                if ('params' in message) {
                    params = message.params;
                }
                $rootScope.$broadcast(message.type, params);
            }
        }
    }

}
