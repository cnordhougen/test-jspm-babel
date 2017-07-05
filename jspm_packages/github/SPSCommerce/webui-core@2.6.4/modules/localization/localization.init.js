var _ = require('lodash');
var moment = require('moment');

module.exports = LocalizationInit;

LocalizationInit.$inject = [
    '$log',
    '$rootScope',
    '$translate',
    'messageBus',
    'currentUser',
    'localizationService'
];

/**
 * Localization initialization for the run phase of the app.
 *
 * @param $log
 * @param $rootScope
 * @param $translate
 * @param messageBus
 * @param currentUser
 * @param localizationService
 * @constructor
 */
function LocalizationInit (
    $log,
    $rootScope,
    $translate,
    messageBus,
    currentUser,
    localizationService) {

    var defaults = {};

    _setupDefaults();
    _setupCSSClasses();
    _setupUserPreferences();
    _setupLanguageChangeHandler();
    _setupTranslateErrorHandling();
    _setupCommercePlatformMessaging();
    _setupUncloaking();

    /**
     * Set some reasonable defaults for the localization settings. These are taken from
     * the user's browser or OS configuration.  If Moment Timezone is available, then
     * that is used to guess the user's timezone, otherwise fallback to UTC.
     *
     * @private
     */
    function _setupDefaults () {
        defaults.locale = $translate.resolveClientLocale();
        defaults.timezone = (moment.tz) ? moment.tz.guess() : 'UTC';
        defaults.language = defaults.locale; // language and locale are usually the same.
    }

    /**
     * Once the current user object is ready to be used, set the localization settings
     * from the user's preferences. If any of the user prefs aren't set, fallback to the
     * default client settings (browser or system via autodetection).
     *
     * @private
     */
    function _setupUserPreferences () {
        messageBus.send('getUserPreferences').onResponse(function(prefs) {
            $rootScope.$applyAsync(function() {
                localizationService.settings.locale = prefs.locale || defaults.locale;
                localizationService.settings.timezone = prefs.timezone || defaults.timezone;
                localizationService.settings.language = prefs.language || defaults.locale;
                $translate.use(localizationService.settings.language);
            });
        });
    }

    /**
     * When the user's language selection changes, use the newly selected language.
     *
     * @private
     */
    function _setupLanguageChangeHandler () {
        localizationService.onLanguageChange($translate.use);
    }

    /**
     * Catch when there are problems loading a translation, try falling back to the
     * client detected language
     *
     * @private
     */
    function _setupTranslateErrorHandling () {
        $rootScope.$on('$translateChangeError', function (event, error) {
            $log.warn('Unable to load language files for', error.language);
            if (error.language !== defaults.language) {
                $translate.use(defaults.language);
            }
        });
    }

    /**
     * Setup communication with Commerce Platform for localization preferences.
     *
     * @private
     */
    function _setupCommercePlatformMessaging() {

        var msg = 'setUserPreferences';

        // Here Commerce Platform is telling us that there are new preferences

        messageBus.on(msg, function(prefs) {
            localizationService.settings.locale = prefs.locale;
            localizationService.settings.language = prefs.language;
            localizationService.settings.timezone = prefs.timezone;
        });

        // Here we are telling Commerce Platform that there are new preferences

        localizationService.onLanguageChange(function(val) {
            messageBus.send(msg, {language: val});
        });

        localizationService.onLocaleChange(function(val) {
            messageBus.send(msg, {locale: val});
        });

        localizationService.onTimezoneChange(function(val) {
            messageBus.send(msg, {timezone: val});
        });
    }

    /**
     * If element cloaking is enabled and a translation successfully loads, we need
     * to uncloak the elements that have been loaded. We glean the loaded text by
     * using the $translate translation tables.
     *
     * @private
     */
    function _setupUncloaking () {
        $rootScope.$on('$translatePartialLoaderStructureChanged', _uncloak);
        $rootScope.$on('$translateLoadingSuccess', _uncloak);
    }

    /**
     * Iterate over each of the loaded keys and uncloak them.
     *
     * @private
     */
    function _uncloak() {
        $rootScope.$applyAsync(function() {
            var table = $translate.getTranslationTable() || {};
            Object.keys(table).forEach(localizationService.uncloakElementsByKey);
        });
    }

    /**
     * Sets a class on the HTML element based upon the current language. This will be
     * useful in the future when some languages require specific design overrides.
     *
     * @private
     */
    function _setupCSSClasses () {
        $rootScope.$on('$translateChangeSuccess', function (event, result) {
            var htmltag = window.document.getElementsByTagName('html')[0];
            var classes = htmltag.className.split(/\s+/);

            // This removes any previously set spsui-lang classes.
            var newset = _.map(classes, function (val) {
                if (!val.match(/^spsui-lang/)) {
                    return val;
                }
            });

            // Add the current language class to the HTML element.
            newset.push('spsui-lang-' + result.language);
            htmltag.className = newset.join(' ');
        });
    }
}
