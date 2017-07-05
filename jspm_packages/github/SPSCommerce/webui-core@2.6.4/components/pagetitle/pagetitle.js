/**
 * <spsui-pagetitle></spsui-pagetitle>
 *
 * @owner Commerce Platform
 */

require('./pagetitle.min.css!');
var angular = require('angular');
require('../../modules/localization');

module.exports = angular.module('spsui.pagetitle', ['webui-localization'])
    .directive('spsuiPageTitle', function () {
        return {
            restrict: 'E',
            template: require('./pagetitle.html!text'),
            scope: {
                pageTitle: '=',
                menuClick: '&',
                showBack: '=',
                backClick: '&'
            }
        };
    });
