
var _ = require('lodash');
var BREAKPOINT_DESKTOP = 1244;

module.exports = SidebarController;

SidebarController.$inject = [
    '$rootScope',
    '$state',
    '$window',
    '$timeout',
    'sidebarService'
];

/**
 * Controller for {@link sidebarDirective}
 * @param $rootScope
 * @param $scope
 * @param $state
 * @param $window
 * @param $timeout
 * @param sidebarService
 */
function SidebarController($rootScope,  $state, $window, $timeout, sidebarService) {

    var vm = this;
    this.isMobile = false;
    this.navObj = [];


    /**
     * add item to navItems
     * @param {object} item - object
     * @property {string} item.id - identifier for item
     * @property {string} item.displayName - used as display nav item
     * @property {string} item.routingState - route to navigate to; EG 'universal-network.applications'
     * @property {string} item.iconClass - used to set icon for navigation
     * @property {boolean} item.authRequiresOrg - [optional] triggers authentication prior to displaying item
     */
    this.addItem = function addItem(item) {
        sidebarService.addItem(item);
    };

    /**
     * remove item from navItems
     * @param {object} item = see {@link this.addItem@item}
     */
    this.removeItem = function removeItem(item) {
        sidebarService.removeItem(item);
    };

    /**
     * listen for ui-router state change success
     */
    $rootScope.$on('$stateChangeSuccess', function () {
        vm.navSelectedItem = $state.current.name;
    });

    /**
     * function to compare window width to BREAKPOINT_DESKTOP passed into the directive
     */
    var checkWidth = function checkWidth() {
        if ($window.innerWidth <= BREAKPOINT_DESKTOP) {
            vm.isMobile = true;
            sidebarService.setMobileLayout();
            sidebarService.enableClickOut();
        } else {
            vm.isMobile = false;
            sidebarService.setDesktopLayout();
            sidebarService.disableClickOut();
        }

        $timeout(function () {
        }, 50); //trigger a digest
    };

    /**
     * initialize sidebar directive - sets config (for navbar items); called by link function
     */
    vm.init = function init() {

        if (!vm.configPath && !vm.configObj) {
            throw new Error('no config options for sidebar');
        }
        if (vm.configPath && vm.configObj) {
            throw new Error('use only one config options, config-path OR config-obj');
        }

        if (vm.configPath) { //fetch json file if passed in config
            //fetchNavItems from sidebar service as a promise
            sidebarService.fetchJson(vm.configPath).then(function (response) {
                vm.navObj = response.items;
                if (response.title) {
                    vm.title = response.title;
                }
            }, function (error) {

                vm.navObj = [];
                throw new Error('error fetching sidebar json', error);

            });
        }
        if (vm.configObj) { // object is not a json file

            vm.navObj = sidebarService.setItems(vm.configObj.items);
            if (vm.configObj.title) {
                vm.title = vm.configObj.title;
            }
        }


        checkWidth();
        $window.onresize = _.debounce(function () {
            checkWidth();

            sidebarService.removeOffCanvas(vm.isMobile);

        }, 150);

        // set navSelectedItem
        if ($state.current) {
            vm.navSelectedItem = $state.current.name;
        } else {
            vm.navSelectedItem = null;
        }

        sidebarService.init(vm.isMobile);
    };

    /**
     * switch width of navigation bar by adding 'narrow nav' to body tag
     */
    /*@TODO: remove comments*/


    /**
     * check to see if passed navigation item is the one selected
     * @param item
     * @returns {boolean}
     */
    vm.isSelected = function isSelected(item) {
        if (!vm.navSelectedItem) {
            return false;
        }
        if (vm.navSelectedItem.indexOf(item.routingState) !== -1) {
            return true;
        } else {
            return false;
        }
    };
}
