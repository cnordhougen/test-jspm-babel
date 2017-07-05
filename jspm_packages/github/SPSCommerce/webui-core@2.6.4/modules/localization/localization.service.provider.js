var $ = require('jquery');
var _ = require('lodash');
var EventHandler = require('webui-core/utils/eventHandler');
var LocalizationOptions = require('./localization.options');

module.exports = LocalizationServiceProvider;

function LocalizationServiceProvider () {

    /**
     * Collection of localization instances, keyed by localization.id
     *
     * @type {Object}
     * @private
     */
    var _instances = {};

    /**
     * Collection of Arrays of HTML elements, keyed by translation id
     *
     * @type {[]}
     * @private
     */
    var _cloakedElements = {};

    /**
     * Option to enable the automatic cloaking of translated elements.
     *
     * @type {boolean}
     * @private
     */
    var _cloaking = false;

    /**
     * Enable or disable the automatic cloaking directive.
     *
     * @param bool
     */
    this.setCloaking = _setCloaking;

    function _setCloaking(bool) {
        _cloaking = Boolean(bool);
    }

    /**
     * Factory for the Localization Service
     */

    this.$get = _$get;

    _$get.$inject = [
        '$log',
        '$translate',
        '$translatePartialLoader',
        'Localization'
    ];

    function _$get ($log, $translate, $translatePartialLoader, Localization) {

        /**
         * LocalizationService
         *
         * @constructor
         */
        function LocalizationService () {

            var _this = this;

            var _settings = {
                locale: 'en-US',
                timezone: 'UTC',
                language: 'en-US'
            };

            var _onLocaleChange = new EventHandler();
            var _onLanguageChange = new EventHandler();
            var _onTimezoneChange = new EventHandler();

            this.setCloaking = _setCloaking;
            this.onLocaleChange = _onLocaleChange.register;
            this.onTimezoneChange = _onTimezoneChange.register;
            this.onLanguageChange = _onLanguageChange.register;

            this.options = {};
            this.settings = {};

            Object.defineProperties(this, {
                options: {
                    get: function() {
                        return LocalizationOptions;
                    }
                },
                cloakedElements: {
                    get: function() {
                        return _cloakedElements;
                    }
                }
            });

            /**
             * Define this.settings properties with getters and setters so that
             * we can trigger individual event handlers when they change, without
             * the need to use any type of observable/watch. Also allows us to
             * do some validation on the values when they are set.
             */
            Object.defineProperties(this.settings, {
                cloaking: {
                    get: function() {
                        return _cloaking;
                    }
                },
                locale: {
                    get: function() {
                        return _settings.locale;
                    },
                    set: function(val) {
                        if (!val || val === _settings.locale) {
                            return;
                        }
                        if (_this.options.locales[val]) {
                            _settings.locale = val;
                            _onLocaleChange.trigger(val);
                        }
                    }
                },
                timezone: {
                    get: function() {
                        return _settings.timezone;
                    },
                    set: function(val) {
                        if (!val || val === _settings.timezone) {
                            return;
                        }
                        _settings.timezone = val;
                        _onTimezoneChange.trigger(val);
                    }
                },
                language: {
                    get: function() {
                        return _settings.language;
                    },
                    set: function(val) {
                        if (_.isArray(val)) {
                            val = val[0];
                        }
                        if (!val || val === _settings.language) {
                            return;
                        }
                        if (_this.options.languages[val]) {
                            _settings.language = val;
                            _onLanguageChange.trigger(val);
                        }
                    }
                }
            });

            /**
             * Public method for configuring the localization service for a specific app
             * or component instance. Takes an object for options, and returns an instance
             * of Localization model specific to the configured app/component.
             *
             * @param {Object} opts
             * @returns {Localization|false}
             */
            this.localize = function (opts) {
                var type;
                var name;
                var localization;
                opts = opts || {};

                if (opts.app) {
                    type = 'app';
                    name = opts.app;
                }
                if (opts.component) {
                    type = 'component';
                    name = opts.component;
                }
                if (!type || !name) {
                    return false;
                }

                localization = new Localization(type, name, opts);
                _instances[localization.id] = localization;

                localization.whenReady().then(function() {
                    _this.registerTranslationPath(localization.path);
                });

                return localization;
            };

            /**
             * Utility for retrieving an existing Localization instance.
             *
             * @param {Object} opts
             * @returns {Localization|false}
             */
            this.getLocalization = function (opts) {
                var id = '';
                if (opts.app) {
                    id = Localization.getId('app', opts.app);
                }
                if (opts.component) {
                    id = Localization.getId('component', opts.component);
                }
                return _instances[id] || false;
            };

            /**
             * Register a translation path with the $translatePartialLoader.
             * This public method can be called during application runtime if
             * additional translation partials are required.
             *
             * @param {String} path
             */
            this.registerTranslationPath = function (path) {
                if (path) {
                    $translatePartialLoader.addPart(path);
                    $translate.refresh();
                }
            };

            /**
             * Cloak an element (hide it) and register it for uncloaking.
             *
             * @param {String} key
             * @param {HTMLElement} elem
             */
            this.cloakElement = function(key, elem) {
                var table = $translate.getTranslationTable() || {};
                if (table[key]) { return; }
                if (!_cloakedElements[key]) {
                    _cloakedElements[key] = [];
                }
                _cloakedElements[key].push(elem);
                $(elem).addClass('cloak');
            };

            /**
             * Uncloak an element (show it).
             *
             * @param {HTMLElement} elem
             */
            this.uncloakElement = function(elem) {
                $(elem).removeClass('cloak');
            };

            /**
             * Iterate over all registered elements of a given key and uncloak them.
             * Unregister the elements so they won't be iterated over again.
             *
             * @param {String} key
             */
            this.uncloakElementsByKey = function(key) {
                _.forEach(_cloakedElements[key], _this.uncloakElement);
                delete _cloakedElements[key];
            };

        }

        return new LocalizationService();
    }
}
