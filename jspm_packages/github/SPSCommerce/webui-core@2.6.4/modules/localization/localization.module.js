var angular = require('angular');

require('./localization.css!');
require('angular-translate');
require('angular-translate-loader-partial');
require('webui-core/modules/currentUser');

window.sps = window.sps || {};

var moduleDeps = [
    'spsui.currentUser',
    'pascalprecht.translate'
];

window.sps.localizationModule = angular.module('webui-localization', moduleDeps)
    .provider('localizationService', require('./localization.service.provider'))
    .provider('localizationErrorHandler', require('./localization.error.handler'))
    .directive('translate', require('./translate.directive.js'))
    .factory('Localization', require('./localization.factory'))
    .config(require('./localization.config'))
    .run(require('./localization.init'));

module.exports = window.sps.localizationModule.name;
