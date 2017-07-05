module.exports = TranslateDirective;

TranslateDirective.$inject = ['$rootScope', 'localizationService'];

/**
 * Custom translate directive to hide the elements until the translations
 * are loaded. This prevents the "Flicker of Untranslated Content".
 *
 * @param $rootScope
 * @constructor
 */
function TranslateDirective ($rootScope, localizationService) {
    return {
        priority: 1,
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            if (localizationService.settings.cloaking) {
                if (attrs.hasOwnProperty('noTranslateCloak') === false) {
                    localizationService.cloakElement(attrs.translate, elem[0]);
                }
            }
        }
    };
}
