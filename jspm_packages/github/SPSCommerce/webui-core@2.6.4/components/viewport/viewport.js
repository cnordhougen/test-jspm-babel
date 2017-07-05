/**
 * <spsui-viewport></spsui-viewport>
 *
 * @owner Commerce Platform
 **/

require('./viewport.min.css!');
var angular = require('angular');

module.exports = angular
    .module('spsui.viewport', [])
    .directive('spsuiViewport', function () {
        return {
            restrict: 'E',
            template: require('./viewport.html!text'),
            transclude: true
        };
    });
