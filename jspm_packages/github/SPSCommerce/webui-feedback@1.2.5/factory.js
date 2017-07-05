
var angular = require('angular');

module.exports = FeedbackFactory;

FeedbackFactory.$inject = ['$rootScope', '$compile'];

/**
 * The FeedbackFactory is a helper utility for generating feedback message
 * objects.  Each method returns an HTMLElement that can then be appended
 * to the DOM at the users' discretion.
 *
 * Usage Examples:
 *
 * // Create a permanent warning message that cannot be closed
 * var msg = FeedbackFactory.warning('System maintenance tonight at 10pm');
 *
 * // Create a closeable error message
 * var msg = FeedbackFactory.error('That is an invalid action', {close: true});
 *
 * // Create a flash success message that disappears in the default duration
 * var msg = FeedbackFactory.success('Everything worked out', {flash: true});
 *
 * // Create a flash info message that disappears after 60 seconds
 * var msg = FeedbackFactory.info('Information is good', {flash: 60});
 *
 * @param $rootScope
 * @param $compile
 * @constructor
 */
function FeedbackFactory($rootScope, $compile) {

    /**
     * A message element is created and options set, then compiled
     * with a new scope and returned.
     *
     * @param {string} [text]
     * @param {object} [opts]
     * @returns {HTMLElement}
     */
    this.newMessage = function(text, opts) {

        text = text || '';
        opts = opts || {};

        var msg = angular.element('<spsui-feedback-msg/>');
        var scope = $rootScope.$new();

        msg.text(text);

        if (opts.type) {
            msg.attr('type', opts.type);
        }

        if (opts.icon) {
            msg.attr('icon', opts.icon);
        }

        if (opts.noicon) {
            msg.attr('noicon', opts.noicon);
        }

        if (opts.label) {
            msg.attr('label', opts.label);
        }

        if (opts.nolabel) {
            msg.attr('nolabel', opts.nolabel);
        }

        if (opts.closeable) {
            msg.attr('closeable', opts.closeable);
        }

        if (opts.flash) {
            msg.attr('flash', opts.flash);
        }

        if (opts.localizeValues) {
            msg.attr('localize-values', JSON.stringify(opts.localizeValues));
        }

        if (opts.onClose) {
            scope.onClose = opts.onClose;
            msg.attr('on-close', 'onClose');
        }

        $compile(msg)(scope);

        return msg[0];
    };


    /**
     * Create and return a new error message
     *
     * @param {string} [text]
     * @param {object} [opts]
     */
    this.error = function(text, opts) {
        opts = angular.extend(opts || {}, {type: 'error'});
        return this.newMessage(text, opts);
    };

    /**
     * Create and return a new info message
     *
     * @param {string} [text]
     * @param {object} [opts]
     */
    this.info = function(text, opts) {
        opts = angular.extend(opts || {}, {type: 'info'});
        return this.newMessage(text, opts);
    };

    /**
     * Create and return a new success message
     *
     * @param {string} [text]
     * @param {object} [opts]
     */
    this.success = function(text, opts) {
        opts = angular.extend(opts || {}, {type: 'success'});
        return this.newMessage(text, opts);
    };

    /**
     * Create and return a new pro-tip message
     *
     * @param {string} [text]
     * @param {object} [opts]
     */
    this.tip = function(text, opts) {
        opts = angular.extend(opts || {}, {type: 'tip'});
        return this.newMessage(text, opts);
    };

    /**
     * Create and return a new warning message
     *
     * @param {string} [text]
     * @param {object} [opts]
     */
    this.warning = function(text, opts) {
        opts = angular.extend(opts || {}, {type: 'warning'});
        return this.newMessage(text, opts);
    };
}
