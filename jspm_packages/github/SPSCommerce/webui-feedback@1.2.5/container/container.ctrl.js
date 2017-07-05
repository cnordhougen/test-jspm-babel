var _ = require('lodash');

module.exports = ContainerController;

ContainerController.$inject = ['$element', '$attrs', 'FeedbackService'];

/**
 *
 * @param $element
 * @param $attrs
 * @param FeedbackService
 * @constructor
 */
function ContainerController($element, $attrs, FeedbackService) {

    var _id = '';

    var _this = this;

    Object.defineProperties(this, {
        id: {
            get: function () {
                return _id;
            }
        }
    });

    _init();

    /**
     * Kickoff the ContainerController by attaching the API
     * to the container element, and then registering it with
     * the FeedbackService.
     *
     * @private
     */
    function _init() {
        $element[0].api = _this;
        _id = $attrs.feedbackId || _.uniqueId();
        FeedbackService.registerContainer(_id, $element);
    }

    /**
     * Cleanly close all messages in the container, firing any
     * attached on-close callbacks on the messages.
     */
    this.closeAll = function() {
        var msgs = $element.find('spsui-feedback-msg');
        _.forEach(msgs, function(msg){
            msg.api.close();
        });
    };

    /**
     * Clean up when the container scope is destroyed
     */
    this.destroy = function() {
        FeedbackService.deregisterContainer(_id);
    };

}
