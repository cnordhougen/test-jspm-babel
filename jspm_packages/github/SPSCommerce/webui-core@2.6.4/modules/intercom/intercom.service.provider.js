var _ = require('lodash');
var angular = require('angular');

module.exports = IntercomServiceProvider;

function IntercomServiceProvider() {

    var $q = angular.injector(['ng']).get('$q');

    var _baseUrl = 'https://widget.intercom.io/widget/';

    var _ready = $q.defer();

    var _settings = {
        name: '',
        email: '',
        app_id: '',
        user_id: '',
        user_hash: '',
        created_at: 0,
        company: {
            id: '',
            name: ''
        }
    };

    _setupGlobal();

    /**
     * Publicize _config();
     * @type {_config}
     */
    this.config = _config;

    /**
     * Publicize _setUrl();
     * @type {_setUrl}
     */
    this.setUrl = _setUrl;

    /**
     * Returns promise that is resolved when the Intercom library
     * has loaded and its API is ready for use. Promise is rejected
     * if the library fails to load.
     *
     * @returns {Promise}
     */
    this.whenReady = function() {
        return _ready.promise;
    };

    /**
     * Create the global Intercom object. This code comes directly
     * from the embed code, so I'm not going to mess with it.
     *
     * @private
     */
    function _setupGlobal() {

        var i = function () {
            i.c(arguments);
        };

        i.q = [];

        i.c = function (args) {
            i.q.push(args);
        };

        window.Intercom = i;
    }

    /**
     * Set Intercom Messenger settings.
     *
     * @param {Object} options
     * @private
     */
    function _config(options) {
        _settings = _.defaultsDeep({}, options, _settings);
    }

    /**
     * Set the base URL used to load Intercom embed code.
     *
     * @param {String} url
     * @private
     */
    function _setUrl(url) {
        _baseUrl = url;
    }

    /**
     * Factory for the service provider.
     */
    this.$get = ['$q', '$log', '$rootScope', function ($q, $log, $rootScope) {

        /**
         * IntercomService
         *
         * @constructor
         */
        function IntercomService() {

            var _this = this;

            /**
             * Read-only access to settings
             */
            Object.defineProperty(_this, 'settings', {
                get: function() {
                    return _settings;
                }
            });

            /**
             * Set Intercom settings.
             * @type {_config}
             */
            _this.config = _config;

            /**
             * Set Intercom library URL.
             * @type {_setUrl}
             */
            _this.setUrl = _setUrl;

            /**
             * Returns promise that is resolved when the Intercom library
             * has loaded and its API is ready for use. Promise is rejected
             * if the library fails to load.
             *
             * @returns {Promise}
             */
            _this.whenReady = function () {
                return _ready.promise;
            };

            /**
             * Kickoff the Intercom experience. Ensures the app_id and user_id
             * settings are available before loading and booting the library.
             *
             * @returns {Promise} resolve on library load, reject if loading error.
             */
            _this.launch = function () {

                var err = 'Unable to launch Intercom: ';

                if (!_settings.app_id) {
                    err += 'app_id not set';
                    return $q.reject(err);
                }

                if (!_settings.user_id) {
                    err += 'user_id not set';
                    return $q.reject(err);
                }

                return _loadLibrary().then(function () {
                    _this.api('boot', _settings);
                    _ready.resolve(_this);
                    return _this;
                }).catch(function () {
                    err += 'library failed to load';
                    _ready.reject(err);
                    return $q.reject(err);
                });
            };

            /**
             * Execute any of the Intercom API methods directly.
             * Intercom docs here: https://goo.gl/anH8hD
             *
             * Example: identityService.api('show');
             */
            _this.api = function () {
                return window.Intercom.apply(window, arguments);
            };

            /**
             * Build and return the custom library URL.
             *
             * @returns {String}
             * @private
             */
            function _getLibraryUrl() {
                return _baseUrl + _settings.app_id;
            }

            /**
             * Fetch and execute the custom Intercom library. Unfortunately, we can't
             * use a System.import or AJAX request to fetch the script due to their CSP
             * restrictions. Instead we have to create a script tag and inject it into
             * the DOM like a bunch of cavemen.
             *
             * @returns {Promise} resolved when script onload fires, reject on error.
             * @private
             */
            function _loadLibrary() {
                return $q(function (resolve, reject) {

                    var d = window.document;
                    var s = d.createElement('script');
                    var b = d.getElementsByTagName('body')[0];

                    b.appendChild(s);

                    s.onload = function() {
                        resolve();
                        $rootScope.$digest();
                    };

                    s.onerror = function(e) {
                        reject(e);
                        $rootScope.$digest();
                    };

                    s.type = 'text/javascript';
                    s.src = _getLibraryUrl();

                });
            }

        }

        return new IntercomService();

    }];
}



