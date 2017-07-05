module.exports = EventHandler;

/**
 * Basic event handler class that can be used to register and unregister
 * handlers in a concise and convenient way.
 *
 * Example:
 *
 *    var onChange = new EventHandler();
 *    var unregister = onChange.register(myCallback);
 *
 *    onChange.trigger('fooBar', 'baz');
 *    unregister();
 *
 * @constructor
 */
function EventHandler () {

    var callbacks = [];

    Object.defineProperty(this, 'callbacks', {
        get: function() {
            return callbacks;
        }
    });

    /**
     * Register an arbitrary handler function. Returns a function that when
     * called will unregister the supplied handler.
     *
     * @param {Function} handler
     * @returns {Function} unregister handler
     */
    this.register = function (callback) {
        callbacks.push(callback);
        return function() {
            callbacks = callbacks.filter(function(item) {
                return (item !== callback);
            });
        };
    };

    /**
     * Execute registered handlers with the same args used to trigger.
     *
     */
    this.trigger = function () {
        var args = arguments;
        callbacks.forEach(function (handler) {
            if (typeof handler === 'function') {
                handler.apply(this, args);
            }
        });
    };

    /**
     * Remove all registered callbacks.
     */
    this.destroy = function() {
        callbacks.length = 0;
    };

}

