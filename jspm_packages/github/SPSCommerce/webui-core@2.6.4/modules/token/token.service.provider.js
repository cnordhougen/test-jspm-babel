var injector = require('./token.injector');

module.exports = TokenServiceProvider;

TokenServiceProvider.$inject = ['$httpProvider'];

function TokenServiceProvider($httpProvider) {

    var _injectAuthHeader = false;

    // Attach the HTTP Header Token Injector onto the $httpProvider.
    // Whether or not the header is actually attached to the request
    // is determined at the time of the request.

    $httpProvider.interceptors.push(injector);

    /**
     * Configuration option for the TokenService.
     *
     * If true, it sets the header AUTHORIZATION: 'Bearer {token}' on
     * every $http request.  This can be useful if the user is making
     * many calls to SPS APIs that require the user token.
     *
     * If false, it does not set the header by default.
     *
     * Defaults to false.
     *
     * @param {Boolean} val
     */
    this.injectAuthHeader = function(val) {
        _injectAuthHeader = Boolean(val);
    };

    this.$get = ['$window', 'messageBus', function ($window, messageBus) {

        /**
         * TokenService provides a way for users to gain access to the
         * user access token as passed from Commerce Platform.
         *
         * @constructor
         */
        function TokenService() {

            var _this = this;
            var _key = 'token';
            var _storage = sessionStorage;

            Object.defineProperties(this, {
                injectAuthHeader: {
                    get: function() {
                        return _injectAuthHeader;
                    }
                },
                token: {
                    get: function() {
                        return _storage.getItem(_key) || '';
                    },
                    set: function(val) {
                        if (val) {
                            _storage.setItem(_key, val);
                        } else {
                            _storage.removeItem(_key);
                        }
                    }
                }
            });

            messageBus.on('userAuthenticated', function(token) {
                _this.token = token;
            });

            messageBus.on('userUnauthenticated', function() {
                _this.token = '';
            });

        }

        return new TokenService();
    }];
}



