/**
 * <spsui-footer></spsui-footer>
 *
 * @owner Commerce Platform
 */

require('./footer.min.css!');
var angular = require('angular');

module.exports = angular.module('spsui.footer', [])
    .directive('spsuiFooter', function () {
        return {
            restrict: 'E',
            template: require('./footer.html!text'),
            controller: FooterCtrl,
            controllerAs: 'ctrl',
            scope:{}
        };
    });

function FooterCtrl(){
    var ctrl = this;
    var year =  new Date().getFullYear();
    ctrl.legal = '©' + year + ' SPS Commerce, Inc. All rights reserved.';
}
