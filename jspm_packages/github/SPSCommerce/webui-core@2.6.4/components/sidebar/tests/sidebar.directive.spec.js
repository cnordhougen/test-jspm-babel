
require('test/harness');
var $ = require('jquery');
var sidebar = require('../sidebar');
var configMock = require('./sidebar.config.mock');

describe('components/sidebar/sidebar.js', function () {
    var scope,
        element,
        compile,
        $templateCache,
        $rootScope,
        $httpBackend,
        $http,
        $state,
        sidebarService,
        authService;

    beforeEach(function () {
        var mockAuthService = {
            getCurrentOrgId: function () {
                return true;
            }
        };
        angular.mock.module(function ($provide) {
            $provide.value('authService', mockAuthService);
        });
    });

    beforeEach(angular.mock.module('mm.foundation.offcanvas'));
    beforeEach(angular.mock.module('spsui.sidebar'));
    beforeEach(angular.mock.module('ui.router'));

    beforeEach(angular.mock.module(function ($stateProvider) {
        $stateProvider.state('sidebar.test', {url: '/sidebar/test'});
        $stateProvider.state('main', {url: '/'});
    }));

    beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$http_, _$state_, _authService_, _sidebarService_, _$templateCache_) {

        $templateCache = _$templateCache_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        scope.dataSource = configMock;
        $http = _$http_;
        $state = _$state_;
        compile = _$compile_;
        $httpBackend = _$httpBackend_;
        sidebarService = _sidebarService_;
        authService = _authService_;

    }));

    describe('config tests', function () {

        it('should load config using passed object', function () {
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-obj="dataSource"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            scope.$digest();
            expect(element.isolateScope().vm.navObj.length).toEqual(4);
        });

        it('should load config using $http.get', function () {
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            $httpBackend.expectGET('/static/js/nav.json').respond(configMock);
            $httpBackend.flush();
            scope.$digest();
            expect(element.isolateScope().vm.navObj.length).toEqual(4);
        });

        it('should reject if json load fails', function () {
            function errorFn() {
                element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
                element = compile(element)(scope).find('spsui-sidebar');
                $httpBackend.expectGET('/static/js/nav.json').respond(500);
                scope.$digest();
                $httpBackend.flush();
            }
            expect(errorFn).toThrowError();
        });

        it('should have a title', function () {
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            $httpBackend.expectGET('/static/js/nav.json').respond(configMock);
            scope.$digest();
            $httpBackend.flush();
            expect(element.isolateScope().vm.title.displayName).toBe('My Product');

        });

    });


    describe('functionality tests', function () {
        beforeEach(function () {

            $state.current.name = 'sidebar.dude';
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            $httpBackend.expectGET('/static/js/nav.json').respond(configMock);
            scope.$digest();
            $httpBackend.flush();
        });
        it('should return true if current state contains item routingState', function () {
            element.isolateScope().vm.navSelectedItem = 'universal-network.people.list';
            var containsName = element.isolateScope().vm.isSelected({routingState: 'universal-network.people'});
            expect(containsName).toBe(true);
        });
        it('should return false if current state does not contain item routingState', function () {
            element.isolateScope().navSelectedItem = 'universal-network.people.list';
            var containsName = element.isolateScope().vm.isSelected('twilight.sparkle');
            expect(containsName).toBe(false);
        });
        it('should return false if there is no navSelectedItem', function () {
            element.isolateScope().navSelectedItem = null;
            var containsName = element.isolateScope().vm.isSelected('twilight.sparkle');
            expect(containsName).toBe(false);
        });
        it('should have navSelectedItem if $state.current is present', function () {
            expect(element.isolateScope().vm.navSelectedItem).toEqual('sidebar.dude');
        });
    });

    describe('null state test', function () {
        beforeEach(function () {

            $state.current = '';
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            $httpBackend.expectGET('/static/js/nav.json').respond(configMock);
            scope.$digest();
            $httpBackend.flush();
        });

        it('should set navSelectedItem to null when there is no $state.current', function () {


            expect(element.isolateScope().navSelectedItem).toBeFalsy();
        });

    });
    describe('state change test', function () {
        beforeEach(function () {
            spyOn($rootScope, '$on').and.callThrough();
            element = '<div class="off-canvas-wrap"><spsui-sidebar config-path="/static/js/nav.json"></spsui-sidebar></div>';
            element = compile(element)(scope).find('spsui-sidebar');
            $httpBackend.expectGET('/static/js/nav.json').respond(configMock);
            scope.$digest();
            $httpBackend.flush();
        });
        it('should update navSelectedItem when state changes', function () {
            $state.current.name = 'sidebar.sparkle';
            $rootScope.$broadcast('$stateChangeSuccess');
            expect(element.isolateScope().vm.navSelectedItem).toEqual('sidebar.sparkle');
            expect($rootScope.$on).toHaveBeenCalled();
        });

    });

    describe('collection controls', function () {
        var colElement, beforeLength, afterLength;
        beforeEach(function () {
            colElement = '<div class="off-canvas-wrap"><spsui-sidebar config-obj="dataSource"></spsui-sidebar></div>';
            colElement = compile(colElement)(scope).find('spsui-sidebar');
            scope.$digest();
            beforeLength = colElement.isolateScope().vm.navObj.length;
        });
        it('should add to the total nav items', function () {
            colElement.isolateScope().vm.addItem({
                id: 'MaryLouRenner'
            });
            afterLength = colElement.isolateScope().vm.navObj.length;
            expect(beforeLength).toBeLessThan(afterLength);
        });
        it('should remove from the nav itemsitems', function () {
            var myItem = {
                "id": "companies",
                "displayName": "Companies",
                "iconClass": "icon-companies",
                "routingState": "universal-network.companies"
            };
            colElement.isolateScope().vm.removeItem(myItem);
            afterLength = colElement.isolateScope().vm.navObj.length;
            expect(beforeLength).toBeGreaterThan(afterLength);
        });
    });

    describe('window checking', function () {
        var colElement;

        it('should set isMobile on Phantoms default size', function () {
            //this is based on PhantomJS's default width of 400x300
            spyOn(sidebarService, 'setMobileLayout').and.callThrough();
            colElement = '<div class="off-canvas-wrap"><spsui-sidebar config-obj="dataSource" ></spsui-sidebar></div>';
            colElement = compile(colElement)(scope);
            scope.$digest();
            expect(sidebarService.setMobileLayout).toHaveBeenCalled();
            expect($('body').hasClass('breakpoint-triggered')).toBe(true);
        });

    });

    describe('error tests', function () {

        it('should throw an error if there is no configuration', function () {
            function noConfigFn() {
                var colElement = '<div class="off-canvas-wrap"><spsui-sidebar></spsui-sidebar></div>';
                colElement = compile(colElement)(scope).find('spsui-sidebar');
                scope.$digest();
            }

            expect(noConfigFn).toThrowError('no config options for sidebar');
        });
        it('should throw an error if both configurations are used', function () {
            function noConfigFn() {
                var colElement = '<div class="off-canvas-wrap"><spsui-sidebar config-obj="dataSource" config-path="/static/js/nav.json"></spsui-sidebar></div>';
                colElement = compile(colElement)(scope).find('spsui-sidebar');
                scope.$digest();
                $httpBackend.flush();
            }

            expect(noConfigFn).toThrowError('use only one config options, config-path OR config-obj');
        });
    });
});


