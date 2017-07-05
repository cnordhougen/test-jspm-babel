/**
 * <spsui-application></spsui-application>
 *
 * This component is the uppermost component used by applications running
 * inside the Commerce Platform.  It provides a set of consistent wrappers
 * to support the use of OffCanvas menus without much fuss.  Specifically,
 * the <spsui-sidebar> component requires the use of this as it's parent.
 *
 * @owner Commerce Platform
 */

require('./application.min.css!');
require('angular-foundation');

var angular = require('angular');
var template = require('./application.html!text');
var controller = require('./application.ctrl');

module.exports = angular.module('spsui.application', ['mm.foundation.offcanvas'])
    .directive('spsuiApplication', function () {
        return {

            restrict: 'E',
            transclude: true,
            template: template,
            controller: controller,
            controllerAs: 'appCtrl',
            link: function(scope, element, attrs, ctrl) {
                if (element.find('spsui-sidebar')[0]) {
                    ctrl.hasSidebar();
                }

                if (element.find('spsui-page-title')[0]) {
                    ctrl.hasPageTitle();
                }

                if (element.find('spsui-page-nav')[0]) {
                    ctrl.hasPageNav();
                }

                if (attrs && attrs.mode && attrs.mode === 'centered') {
                    ctrl.centered();
                }
            }
        };
    });
