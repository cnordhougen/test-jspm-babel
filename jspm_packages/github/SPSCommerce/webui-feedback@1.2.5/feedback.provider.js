var _ = require('lodash');

module.exports = FeedbackDirectiveProvider;

/**
 * Allows general default options by type.
 * 
 */
function FeedbackDirectiveProvider () {
    var _this = this;
    this.configuredDefaults = {};

    /**
     * Used to store multiple configurations
     * using feedback message type as the key
     * for use by the message controller later.
     * 
     * Example: 
     * FeedbackConfigProvider.setDefaults(
     *    {
     *      "success": {flash: 5500},
     *      "error": {closable: true}
     *     }
     * )
     * 
     * @param configObject {Object}
     */
    this.setDefaults = function (configObj) {
        _.assign(_this.configuredDefaults, configObj);
    };

    /**
     * Used to store a single default configuration 
     * for use by the message controller later.
     * 
     * @param type {String}
     * @param options {Object}
     */
    this.setDefault = function (type, options) {
        _this.configuredDefaults[type] = options;
    };

    this.$get = function () {
        return _this;
    };
}
