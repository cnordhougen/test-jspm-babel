
module.exports = LocalizationConfig;

LocalizationConfig.$inject = ['$translateProvider'];

/**
 * Configure the $translate service to use our SPS specific configuration
 *
 * @param $translateProvider
 * @constructor
 */
function LocalizationConfig($translateProvider) {

    $translateProvider
        .usePostCompiling(true)
        .uniformLanguageTag('bcp47')
        .useSanitizeValueStrategy('escape')
        .useLoader('$translatePartialLoader', {
            loadFailureHandler: 'localizationErrorHandler',
            urlTemplate: '{part}/{lang}.json',
            $http: {
                useToken: false
            }
        });

}
