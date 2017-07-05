var angular = require('angular');

module.exports = angular
    .module('localizationExampleComponent', [
        require('core/modules/localization')
    ])
    .directive('componentExample', function() {
        return {
            template: '<p translate="localizationComponentExample.p"></p>'
        };
    })
    .run(['localizationService', function (localizationService) {

        localizationService.localize({
            component: 'localization-example-component',
            path: './i18n/component/'
        });

    }]).name;
