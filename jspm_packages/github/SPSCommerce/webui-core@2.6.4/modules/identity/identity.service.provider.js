var _ = require('lodash');

module.exports = IdentityServiceProvider;

function IdentityServiceProvider() {

    var _prot = 'https://';
    var _base = 'id.spsc.io/identity/';

    var _methods = {
        get: 'get',
        put: 'put',
        head: 'head',
        post: 'post',
        patch: 'patch',
        delete: 'delete',
    };

    var _envs = {
        dev: _prot + 'dev.' + _base,
        test: _prot + 'test.' + _base,
        stage: _prot + 'stage.' + _base,
        prod: _prot + _base
    };

    var _env = _envs.dev;

    /**
     * Publicize _getEnv().
     * @type {_getEnv}
     */
    this.getEnv = _getEnv;

    /**
     * Publicize _setEnv().
     * @type {_setEnv}
     */
    this.setEnv = _setEnv;

    /**
     * Publicize _getUrl().
     * @type {_getUrl}
     */
    this.getUrl = _getUrl;

    /**
     * Publicize _setUrl().
     * @type {_setUrl}
     */
    this.setUrl = _setUrl;

    /**
     * Fetch the current environment name.
     *
     * @returns {String|False}
     * @private
     */
    function _getEnv() {
        return _.invert(_envs)[_env] || '';
    }

    /**
     * During the config phase the user can select which Identity
     * environment they want to use for this session. Returns the
     * resulting server address if the value was valid, or false
     * if option is not valid.
     *
     * Options: dev | test | stage | prod
     * Returns: https://dev.id.spsc.io/identity/
     *          https://test.id.spsc.io/identity/
     *          https://stage.id.spsc.io/identity/
     *          https://id.spsc.io/identity/
     *
     * @param {String} env
     * @returns {String|Boolean}
     */
    function _setEnv(env) {
        if (_envs[env]) {
            _env = String(_envs[env]);
            return _env;
        }
        return false;
    }

    /**
     * Fetch the current environment url.
     *
     * @returns {String}
     * @private
     */
    function _getUrl() {
        return _env;
    }

    /**
     * During the config phase, the user can set which Identity server
     * they want to use by passing in the entire URL. No validation is
     * done on the URL, assume that the user knows what they are doing.
     * Returns the value that was passed in.
     *
     * @param {String} url
     * @returns {String}
     */
    function _setUrl(url) {
        _env = String(url);
        return _env;
    }

    /**
     * Factory for the service provider.
     */
    this.$get = ['$q', '$http', function ($q, $http) {

        /**
         * IdentityService
         *
         * @constructor
         */
        function IdentityService() {

            var _this = this;

            var _ready = $q.defer();

            /**
             * Returns promise that is resolved when the Identity
             * environment is set and the API is ready to use.
             *
             * @returns Promise - resolved when env is set
             */
            _this.whenReady = function () {
                return _ready.promise;
            };

            /**
             * Externally resolve the ready promise. This is used
             * when the Identity env is set from auto-detection of
             * the Commerce Platform environment.
             */
            _this.ready = function() {
                _ready.resolve();
            };

            /**
             * Externally reject the ready promise. This is used
             * when the Identity env is unknown because the app
             * is running outside of Commerce Platform.
             */
            _this.reject = function(reason) {
                _ready.reject(reason);
            };

            /**
             * Allow user to get env during run phase.
             * @type {_getEnv}
             */
            _this.getEnv = _getEnv;

            /**
             * Allow user to set env during run phase.
             * @type {_setEnv}
             */
            _this.setEnv = _setEnv;

            /**
             * Allow user to get url during run phase.
             * @type {_getUrl}
             */
            _this.getUrl = _getUrl;

            /**
             * Allow user to set url during run phase.
             * @type {_setUrl}
             */
            _this.setUrl = _setUrl;

            /**
             * HTTP GET request to Identity.
             *
             * @param {String} path
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.get = function (path, config) {
                return _httpRequest(_methods.get, path, {}, config);
            };

            /**
             * HTTP DELETE request to Identity.
             *
             * @param {String} path
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.delete = function (path, config) {
                return _httpRequest(_methods.delete, path, {}, config);
            };

            /**
             * HTTP HEAD request to Identity.
             *
             * @param {String} path
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.head = function (path, config) {
                return _httpRequest(_methods.head, path, {}, config);
            };

            /**
             * HTTP POST request to Identity.
             *
             * @param {String} path
             * @param {Object} [data]
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.post = function (path, data, config) {
                return _httpRequest(_methods.post, path, data, config);
            };

            /**
             * HTTP PUT request to Identity.
             *
             * @param {String} path
             * @param {Object} [data]
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.put = function (path, data, config) {
                return _httpRequest(_methods.put, path, data, config);
            };

            /**
             * HTTP PATCH request to Identity.
             *
             * @param {String} path
             * @param {Object} [data]
             * @param {Object} [config]
             * @returns {Promise}
             */
            _this.patch = function (path, data, config) {
                return _httpRequest(_methods.patch, path, data, config);
            };

            /**
             * Make an HTTP request to Identity, returning a promise that is resolved
             * with the response. The request is wrapped so that it will not be executed
             * until the identityService is ready (configured for environment).
             *
             * @param {String} method (get|head|delete|post|put|patch)
             * @param {String} path
             * @param {Object} [data]
             * @param {Object} [config]
             * @returns {Promise}
             * @private
             */
            function _httpRequest(method, path, data, config) {

                return _this.whenReady().then(function() {

                    path = String(_env) + String(path);

                    config = config || {};  // Extend the config to ensure that the token
                    config.useToken = true; // is always passed in the Authorization header.

                    if ($http[method] === undefined) {

                        throw new Error('Cannot make request of type: ' + method);

                    } else {

                        // Angular $http methods vary in their arguments, so switch through
                        // and ignore the data object for get/head/delete calls.

                        switch (method) {
                            case _methods.get:
                            case _methods.head:
                            case _methods.delete:
                                return $http[method](path, config);

                            default:
                                return $http[method](path, data, config);
                        }
                    }
                });
            }

            /**
             * GET request for fetching the user details of a given token.
             *
             * @emits spsui.identity.whoami
             * @returns {Promise}
             */
            _this.whoami = function () {
                return _this.get('users/me/').then(function (response) {
                    return response.data;
                });
            };

        }

        return new IdentityService();
    }];
}



