var _ = require('lodash');
var url = require('webui-core/utils/url');

module.exports = LocalizationFactory;

LocalizationFactory.$inject = [
    '$q',
    '$log',
    '$http',
    'commercePlatform'
];

/**
 * Angular factory for the Localization class.
 *
 * @param $q
 * @param $log
 * @param $http
 * @param commercePlatform
 * @returns {Localization}
 * @constructor
 */
function LocalizationFactory($q, $log, $http, commercePlatform) {

    /**
     * The URL base used for fetching language files. This should be a CDN url
     * for aggressive caching.
     *
     * @type {string}
     */
    const BASE_LANGUAGE_URL = 'https://cdn.spsc.io/framework/i18n/';

    /**
     * The URL base used for fetching version files. This should NOT be a CDN url
     * (due to the nature of the version files to change).
     *
     * @type {string}
     */
    const BASE_VERSION_URL = 'https://s3.amazonaws.com/static-assets.spscommerce.com/framework/i18n/';

    /**
     * Localization class: maintains localization settings for a single app or component.
     * This class has knowledge of the SPS specific i18n folder structure in S3, and how
     * to determine which localization version to load for a given app or component.
     *
     * This is used by LocalizationService to register paths with $translatePartialLoader.
     *
     * @param {String} type ("app" or "component")
     * @param {String} name
     * @param {Object} [opts]
     * @constructor
     */
    function Localization (type, name, opts) {

        var _this = this;
        var _ready = false;

        this.type = type || '';
        this.name = name || '';
        this.id = Localization.getId(this.type, this.name);

        this.env = '';
        this.part = '';
        this.path = '';
        this.version = '';

        this.opts = _.defaults({}, opts, {
            versionUrl: BASE_VERSION_URL,
            languageUrl: BASE_LANGUAGE_URL,
        });

        this.init = _init;
        this.getPath = _getPath;
        this.getVersion = _getVersion;
        this.getEnvironment = _getEnvironment;

        /**
         * Kick off the localization instance by running a series of asynchronous requests
         * and building out the unknown properties: env, version, and path.
         *
         * @returns {Promise} resolved when all async calls resolve
         * @private
         */
        function _init () {

            _ready = $q.resolve()
                     .then(function() {
                         return _this.getEnvironment().then(function (env) {
                             _this.env = env;
                         });
                     })
                     .then(function() {
                         return _this.getVersion().then(function (version) {
                             _this.version = version;
                         });
                     })
                     .then(function() {
                         return _this.getPath().then(function (path) {
                             _this.path = path;
                         });
                     }).catch(function (e) {
                         _logUnableToLoadWarning(e);
                         return $q.reject(e);
                     });

            return _ready;

        }

        /**
         * Returns promise that resolves when the localization instance is ready to use.
         * If the instance has not be initialized, init it now.
         *
         * @returns {Promise} resolved when localization instance is ready
         */
        this.whenReady = function () {
            if (!_ready) { _this.init(); }
            return _ready;
        };

        /**
         * Fetch the current environment from Commerce Platform. Resolves with 'local'
         * if the environment cannot be determined.
         *
         * @returns {Promise} resolved with env string prod|stage|test|dev|local
         */
         function _getEnvironment () {
            return commercePlatform.getEnvironment().catch(function () {
                return $q.resolve('local');
            });
         }

        /**
         * Fetch the current translation build version for the given app/component.
         *
         * @returns {Promise} resolved with version string, rejected if problems.
         * @private
         */
         function _getVersion() {
            var versionFile = url.join(_getVersionUrl(), _this.env + '.json');
            return $http.get(versionFile, {useToken: false}).then(function (resp) {
                if (!resp.data || !resp.data.version) {
                    var errMsg = _this.name + ' localization version JSON did not contain valid version';
                    return $q.reject(errMsg);
                }
                return resp.data.version;
            });
         }

        /**
         * Build the current translation file path for the given app/component.
         *
         * @returns {Promise} resolved with translation file path
         */
        function _getPath() {
            return $q.resolve(url.join(_getLanguageUrl(), _this.version));
        }

        /**
         * Build the URL string used for finding the version files.
         *
         * @returns {String}
         * @private
         */
        function _getVersionUrl () {
            return _this.opts.path || url.join(_this.opts.versionUrl, _getFolderName(_this.type), _this.name);
        }

        /**
         * Build the URL string used for finding the localization language files.
         *
         * @returns {String}
         * @private
         */
        function _getLanguageUrl () {
            return _this.opts.path || url.join(_this.opts.languageUrl, _getFolderName(_this.type), _this.name);
        }

        /**
         * Pluralize the folder name for "apps" and "components" (to match S3 folder structure).
         *
         * @param {String} type
         * @returns {String}
         * @private
         */
        function _getFolderName(type) {
            switch(type) {
                case 'app':
                case 'component':
                    return type + 's';
                default:
                    return type;
            }
        }

        /**
         * Trigger a browser console warning about inability to load localization.
         *
         * @private
         */
        function _logUnableToLoadWarning(e) {
            if (e) { $log.error(e); }
            $log.warn('Unable to load localization file for', _this.name, _this);
        }

    }

    /**
     * Static method for generating unique localization ID's
     *
     * @param type
     * @param name
     * @returns {*}
     */
    Localization.getId = function (type, name) {
        type = String(type || _.uniqueId());
        name = String(name || _.uniqueId());
        return [type, name].join('-');
    };

    return Localization;
}

