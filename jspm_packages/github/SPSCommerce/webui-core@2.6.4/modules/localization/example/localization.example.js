var angular = require('angular');

module.exports = angular
    .module('localizationExample', [
        require('core/all').name,
        require('core/modules/localization'),
        require('./localization.example.component')
    ])
    .controller('AppController', AppController)
    .config([
            'localizationServiceProvider',
            'commercePlatformProvider',
            function(localizationServiceProvider, commercePlatformProvider){
                localizationServiceProvider.setCloaking(true);
                commercePlatformProvider.setEnvironment('dev');
            }
    ])
    .run(['localizationService', function (localizationService) {

        localizationService.localize({
            app: 'localization-example',
            path: './i18n/app/'
        });
    }]);

AppController.$inject = ['localizationService'];

function AppController(localizationService) {

    // These are examples of how to use the localizationService (should you need it).

    var instance = localizationService.getLocalization({app: 'localization-example'});

    instance.whenReady().then(function() {
        console.log('For:', instance.name);
        console.log('In environment: ', instance.env);
        console.log('Load version:', instance.version);
        console.log('From:', instance.path);
    });

    this.switch = function(lang) {
        localizationService.settings.language = lang;
    };

}
