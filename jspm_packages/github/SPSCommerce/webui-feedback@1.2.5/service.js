var _ = require('lodash');

module.exports = FeedbackService;

/**
 *
 * @constructor
 */
function FeedbackService() {

    var _this = this;

    var _containers = {};

    var _messageQueue = {};

    /**
     * Store reference to a container.
     *
     * @param {string} id
     * @param {ng.element} $element
     */
    this.registerContainer = function (id, $element) {
        _containers[id] = $element;

        var queue = _this.getQueue(id);
        if (queue) {
            _.forEach(queue, function (msg) {
                _this.sendMsgToContainer(msg, id);
            });
            delete _messageQueue[id];
        }
    };

    /**
     * Delete reference to a container.
     *
     * @param {string} id
     */
    this.deregisterContainer = function (id) {
        delete _containers[id];
    };

    /**
     * Return container element by id
     *
     * @param {string} id
     * @returns {ng.element}
     */
    this.getContainer = function (id) {
        return _containers[id];
    };


    /**
     * Return message queue by id
     *
     * @param {string} id
     * @returns {array}
     */
    this.getQueue = function (id) {
        return _messageQueue[id];
    };

    /**
     * Append a message element to a specific container
     *
     * @param {ng.element} msg
     * @param {string} id
     */
    this.sendMsgToContainer = function(msg, id) {
        var container = _this.getContainer(id);
        if (container) {
            container.append(msg);
        } else {
            var queue = _this.getQueue(id);
            if (queue) {
                queue.push(msg);
            } else {
                _messageQueue[id] = [msg];
            }
        }
    };

    /**
     * Clear messages from a single container and clears it's queued messages
     *
     * @param {string} id
     */
    this.clearContainer = function(id) {
        var container = _this.getContainer(id);
        if (container) {
            container[0].api.closeAll();
        }
        _messageQueue = _.omit(_messageQueue, id);
    };

    /**
     * Clear messages from all containers and queues
     */
    this.clearAllContainers = function () {
        _.forEach(_containers, function (container) {
            container[0].api.closeAll();
        });
        _messageQueue = {};
    };

}
