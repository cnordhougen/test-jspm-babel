
var controller = require('./sidebar.controller');
var template = require('./sidebar.html!text');

/**
 * sidebar directive function
 */
module.exports = function sidebarDirective() {
    return {
        scope: {
            configObj: '=',
            configPath: '@'
        },
        restrict: 'E',
        controller: controller,
        controllerAs: 'vm',
        bindToController: true,
        template: template,
        link: function linkFunc(scope, el, attr, vm) {
            if (attr.configPath) {
                vm.configPath = attr.configPath;
            }
            vm.init();
        }
    };
};





