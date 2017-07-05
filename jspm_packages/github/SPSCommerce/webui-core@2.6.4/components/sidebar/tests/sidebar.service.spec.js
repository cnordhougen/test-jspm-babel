
require('test/harness');
require('../sidebar');

describe('components/sidebar/sidebar.service.js', function () {

    var rootScope, scope, $httpBackend, $window, sidebarService, itemsObj;
    beforeEach(angular.mock.module('spsui.sidebar'));

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$window_, _sidebarService_) {
        $httpBackend = _$httpBackend_;
        $window = _$window_;
        rootScope = _$rootScope_;
        scope = rootScope.$new();
        sidebarService = _sidebarService_;
        itemsObj = {
            "items": [{
                "id": "dashboard",
                "displayName": "Dashboard",
                "iconClass": "icon-dashboard",
                "routingState": "universal-network.dashboard"
            }, {
                "id": "companies",
                "displayName": "Companies",
                "iconClass": "icon-companies",
                "routingState": "universal-network.companies"
            }, {
                "id": "people",
                "displayName": "People",
                "iconClass": "icon-people",
                "routingState": "universal-network.people"
            }, {
                "id": "applications",
                "displayName": "Applications",
                "iconClass": "icon-apps",
                "routingState": "universal-network.applications",
                "authRequiresOrg": true
            }]
        };
    }));
    describe('setup items array tests via json', function () {
        beforeEach(function () {
            $httpBackend.expectGET('bob').respond(itemsObj);
        });
        it('should return an array of items on the json call', function () {
            sidebarService.fetchJson('bob').then(function (result) {
                expect(result.items.length).toEqual(4);
            });
            $httpBackend.flush();
        });
    });
    describe('json fail test', function () {
        beforeEach(function () {
            $httpBackend.expectGET('/myjson').respond(500);
        });
        it('should send error obj on json fail', function () {
            sidebarService.fetchJson('/myjson').then(function (result) {
                expect(result.msg).toBe('error');
            });
            $httpBackend.flush();
        });
    });
    describe('setup items array test via obj', function () {
        it('should set the itemsArray from object', function () {
            itemsObj.items.push({id: 'disneyland', displayName: 'Disney Land'});
            var servedItems = sidebarService.setItems(itemsObj.items);
            expect(servedItems.length).toEqual(5);
        });
        afterEach(function () {
            sidebarService.itemsArray.length = 0;
        });
    });

    describe('nav array manipulation', function () {
        var baseItems, beforeVal;
        beforeEach(function () {
            sidebarService.itemsArray = [];

            baseItems = sidebarService.setItems([{
                "id": "aggro",
                "displayName": "Aggresive",
                "iconClass": "icon-battle",
                "routingState": "universal-network.battle"
            }, {
                "id": "control",
                "displayName": "Control",
                "iconClass": "icon-clamp",
                "routingState": "universal-network.control"
            }]);
            beforeVal = baseItems.length;
        });
        it('should increase the array from 2 to 3', function () {
            sidebarService.addItem({id: 'twilightSparkle', displayName: 'Twilight Sparkle'});
            expect(baseItems.length).toEqual(3);
        });
        it('should decrease array to 1', function () {
            sidebarService.removeItem({id: 'aggro', displayName: 'Aggresive'});
            expect(baseItems.length).toEqual(1);
        });
        it('should not decrease array if there is no match', function () {
            sidebarService.removeItem({id: 'tweety', displayName: 'Bird'});
            expect(baseItems.length).toEqual(2);
        });
    });
    describe('dom manipulation', function () {

        beforeEach(function () {
            $('body').removeClass('no-nav');
            $('body').removeClass('breakpoint-triggered');
            var outerWrap = '<div class="off-canvas-wrap move-right"></div>';
            $('body').html(outerWrap);
            $('.off-canvas-wrap').append('<div class="inner-wrap"></div>');
            rootScope.$apply();


        });
        afterEach(function () {
            $('body').removeClass('no-nav');
            $('body').removeClass('breakpoint-triggered');
            $('.outer-wrap').remove();

        });
        it('should toggle no-nav class on body', function () {

            sidebarService.toggleNav();
            expect($('body').hasClass('no-nav')).toBeTruthy();
            sidebarService.toggleNav();
            expect($('body').hasClass('no-nav')).toBeFalsy();
        });

        it('should add breakpoint-triggered', function () {
            var before = $('body').hasClass('breakpoint-triggered');

            sidebarService.setMobileLayout();

            var after = $('body').hasClass('breakpoint-triggered');
            expect(before).not.toEqual(after);
            expect($('.inner-wrap').height()).toBeGreaterThan(0);
        });
        it('should remove breakpoint-triggered', function () {
            $('body').addClass('breakpoint-triggered');
            sidebarService.setDesktopLayout();
            expect($('body').hasClass('breakpoint-triggered')).toBe(false);
            expect($('.inner-wrap').height()).toEqual(0);
        });

        it('should retract off canvas', function () {


            sidebarService.removeOffCanvas();

            expect($('.off-canvas-wrap').hasClass('move-right')).toBeFalsy();
        });

        it('should bind click event to $window', function () {
            sidebarService.enableClickOut();
            spyOn(sidebarService, 'removeOffCanvas');
            $(window).click();

            expect($window.onclick).not.toBeNull();
            expect(sidebarService.removeOffCanvas).toHaveBeenCalled();
        });

        it('should remove click event from  $window', function () {
            sidebarService.disableClickOut();
            spyOn(sidebarService, 'removeOffCanvas');
            $(window).click();

            expect($window.onclick).toBeNull();
            expect(sidebarService.removeOffCanvas).not.toHaveBeenCalled();
        });




    });


});

