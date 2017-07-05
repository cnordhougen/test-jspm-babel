var config = require('../config');
var _ = require('lodash');

module.exports = MessageController;

MessageController.$inject = ['$scope', '$element', '$attrs', '$transclude', '$timeout', 'FeedbackService', 'FeedbackConfig'];

/**
 * This is the controller for spsui-feedback directive components.
 * It is responsible for determining the classes and icons to be
 * used based upon the type of feedback message desired. It also
 * provides the close and flash mechanism which will remove the
 * message from the DOM.  Currently, nothing is done to destroy
 * the directive completely when it is closed.
 *
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $transclude
 * @param $timeout
 * @param FeedbackService
 * @param FeedbackConfig
 * @constructor
 */
function MessageController($scope, $element, $attrs, $transclude, $timeout, FeedbackService, FeedbackConfig) {

    var _this = this;

    var _element = $element;

    /**
     * Public settings for the feedback message
     * @type {object}
     */
    this.settings = {
        icon: '',
        text: '',
        type: '',
        label: '',
        flash: false,
        closeable: false,
        translateValues: {},
        onClose: function(){}
    };

    _init();

    /**
     * Kickoff the MessageController and setup the feedback message
     * based on it's user configured attributes.
     *
     * @private
     */
    function _init() {

        // Attach message value to scope for message override
        _this.message = $scope.message;
        
        // Attach this controller to the element
        // so that it's API can be accessed outside
        // of the original context it was created.

        $element[0].api = _this;

        _mergeDefaults($attrs.type, FeedbackConfig.configuredDefaults);

        _setType($attrs.type);
        _setIcon($attrs.icon);
        _setLabel($attrs.label);
        _setFlash($attrs.flash);
        _setNoIcon($attrs.noicon);
        _setNoLabel($attrs.nolabel);
        _setCloseable($attrs.closeable);

        _setOnClose($scope.onClose);

        _this.settings.localizeValues = $scope.localizeValues;
    }

    /**
     * Closes the feedback message by adding a 'fade' class to the
     * element, which triggers it to fade out over a short duration.
     * Use a timeout to remove the element from the DOM after the
     * animation is complete.  Calls the onClose callback.
     *
     * @public
     */
    this.close = function() {
        _element.addClass('fade');
        $timeout(function(){
            _element.remove();
            _this.settings.onClose();
        }, config.remove.duration);
    };

    /**
     * Send this message to a specific container.
     *
     * @param {string} containerId
     */
    this.sendTo = function(containerId) {
        FeedbackService.sendMsgToContainer(_element, containerId);
        if (_this.settings.flash) {
            $timeout(function() {
                _this.close();
            }, _this.settings.flash);
        }
    };

    /**
     * Set whether the feedback message can be closed by the user.
     *
     * @param {string} closeable
     * @private
     */
    function _setCloseable(closeable) {
        // handle default overrides
        if (closeable === 'false') {
            return;
        }
        _this.settings.closeable = typeof closeable !== 'undefined' && closeable !== 'false';
        
    }

    /**
     * Set whether the feedback message should only appear temporarily
     * and then be removed automatically.  If no value is passed in at
     * time of creation, then a default duration is set.  Otherwise,
     * the user can specify how long to leave the message by setting
     * the flash duration.
     *
     * @param {number} duration
     * @private
     */
    function _setFlash(duration) {
        // handle default overrides
        if (duration === 'false') {
            return;
        }
        if (typeof duration !== 'undefined') {
            _this.settings.flash = parseInt(duration, 10) || config.flash.duration;
        }
    }

    /**
     * Set the icon of the feedback message. By default each message
     * type has it's own default icon, but this can be set by the user.
     *
     * @param {string} icon
     * @private
     */
    function _setIcon(icon) {
        if (typeof icon !== 'undefined') {
            _this.settings.icon = icon;
        }
    }

    /**
     * Disable the icon.
     *
     * @param {boolean} noicon
     * @private
     */
    function _setNoIcon(noicon) {
        // handle default overrides
        if (noicon === 'false') {
            return;
        }
        if (typeof noicon !== 'undefined') {
            _this.settings.icon = '';
        }
    }

    /**
     * Disable the label.
     *
     * @param {boolean} nolabel
     * @private
     */
    function _setNoLabel(nolabel) {
        // handle default overrides
        if (nolabel === 'false') {
            return;
        }
        if (typeof nolabel !== 'undefined') {
            _this.settings.label = '';
        }
    }

    /**
     * Set the label of the feedback message.  By default each message
     * type has it's own default label, but this can be set by the user.
     * 
     * Custom labels will be used as a custom key if the key
     * attribute is not used in translated messages.
     *
     * @param {string} label
     * @private
     */
    function _setLabel(label) {
        if (typeof label !== 'undefined') {
            _this.settings.label = label;
        }
    }

    /**
     * There are a handful of default feedback message types that
     * can be used.  This sets the appropriate label and icon to
     * the message based upon the chosen type. Types are specified
     * in the config settings.
     *
     * @param {string} type
     * @private
     */
    function _setType(type) {
        type = (config.types[type]) ? type : config.default;
        _this.settings.type = type;
        _this.settings.icon = config.types[type].icon;
        _this.settings.label = config.types[type].label;
    }

    /**
     * Set the onClose callback function.  By default this value is a
     * noop function, but a callback can be provided by the user.
     *
     * @param {function} func
     * @private
     */
    function _setOnClose(func) {
        if (_.isFunction(func)) {
            _this.settings.onClose = func;
        }
    }

    /**
     * Merge options set at config time. These will update
     * attributes that haven't been set'
     * 
     * @param type {string}
     * @param providerDefaults {Array}
     * @private
     */
    function _mergeDefaults (type, providerDefaults) {

        if (!providerDefaults[type]) {
            return;
        }

        _.defaults($attrs, providerDefaults[type]);
       
    }

}
