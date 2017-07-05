module.exports = LocalizationErrorHandlerProvider;

/**
 * Angular provider for LocalizationErrorHandler
 * @constructor
 */
function LocalizationErrorHandlerProvider () {

    this.$get = _$get;

    _$get.$inject = ['$q', '$log'];

    function _$get ($q, $log) {

        /**
         * Error handler that is passed to $translatePartialLoader. This error handler
         * will log a warning, but always returns a resolved promise. This allows apps
         * and components to have partial-translation support. Otherwise a single missing
         * translation file would prevent an entire app from translating.
         *
         */
        function LocalizationErrorHandler (url, lang, response) {
            if (lang !== 'keys') {
                $log.warn('Unable to load language file:', response.config.url);
            }
            return $q.resolve({});
        }

        return LocalizationErrorHandler;
    }
}
