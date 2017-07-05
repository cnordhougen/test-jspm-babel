var angular = require('angular');

require('angular-ui-router');
require('angular-foundation');
require('./sidebar.min.css!');

var service = require('./sidebar.service');
var directive = require('./sidebar.directive');

var ngDependecies = [
    'mm.foundation.offcanvas',
    'ui.router'
];

module.exports = angular.module('spsui.sidebar', ngDependecies)
                        .directive('spsuiSidebar', directive)
                        .factory('sidebarService', service);
