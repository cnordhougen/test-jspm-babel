var angular = require('angular');

require('angular-ui-router');
require('./page-nav.min.css!');
require('../../modules/localization');

var service = require('./page-nav.service');
var directive = require('./page-nav.directive');

var ngDependecies = [
    'ui.router',
    'webui-localization'
];

module.exports = angular
    .module('spsui.pagenav', ngDependecies)
    .directive('spsuiPageNav', directive)
    .factory('pageNavService', service);
