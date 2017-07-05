require('test/harness');
require('./pagination-footer');
require('../../modules/localization');

var jQuery = require('jquery');

describe('spsui-pagination-footer', function () {

    var $scope, paginator, $compile, $httpBackend, $translate, $translatePartialLoader,
        itemsPerPageSelect, options, prevButton, nextButton, pageNumberInput, lastPageLink;

    beforeEach(function () {
        angular.mock.module('ui.router');
        angular.mock.module('spsui.paginationfooter');
        angular.mock.module('webui-localization', function ($provide) {
            $provide.value('currentUser', require('webui-core/modules/currentUser/currentUser.mock'));
            $provide.value('identityService', require('webui-core/modules/identity/identity.service.mock'));
            $provide.value('commercePlatform', require('webui-core/modules/commercePlatform/commercePlatform.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });

        inject(function ($injector) {
            $scope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $translate = $injector.get('$translate');
        });
    });

    function compileDirective() {
        var template = '<spsui-pagination-footer api="pagination" search-params="searchParams" size-options="pageSizeOptions" on-ready="onReady" on-change="onChange"></spsui-pagination-footer>';
        paginator = jQuery($compile(template)($scope));
        $scope.$digest();
    }

    it("should default completely empty values correctly", function () {
        compileDirective();
        expect($scope.pagination.state.pageSize).toBe(25);
        expect($scope.pageSizeOptions).toEqual([25, 50, 100]);
    });

    it("should default pageSize correctly given sizeOptions", function () {
        $scope.pageSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        compileDirective();
        expect($scope.pagination.state.pageSize).toBe(1);
    });

    describe('should use attributes and', function () {

        beforeEach(function () {
            inject(function ($injector) {
                $scope.pagination = {};
                $scope.pageSizeOptions = [10, 25, 50, 100];
                $scope.onChange = jasmine.createSpy('onChange');
                $scope.onReady = jasmine.createSpy('onReady').and.callFake(function () {
                    $scope.pagination.setTotalItems(60);
                    $scope.pagination.setPageSize(25, true);
                });
                $compile = $injector.get('$compile');
                $timeout = $injector.get('$timeout');

                compileDirective();

                itemsPerPageSelect = paginator.find('select');
                options = itemsPerPageSelect.find('option');

                nextButton = paginator.find(".pagination button:last");
                prevButton = paginator.find(".pagination button:first");

                pageNumberInput = paginator.find('input');
                lastPageLink = paginator.find('a.last-page-link');
            });
        });

        function paginatorState() {
            return paginator.find('.pagination-status strong').eq(0).text();
        }

        it("should let you know when it's ready", function () {
            expect($scope.onReady).toHaveBeenCalled();
            expect($scope.pagination.state.pageSize).toBe(25);
            expect($scope.pagination.state.totalItems).toBe(60);
        });

        it("should react to pagination buttons", function () {
            expect($scope.pagination.state.pageNumber).toBe(1);
            paginator.find(".pagination button:last").click();
            expect($scope.pagination.state.pageNumber).toBe(2);
            paginator.find(".pagination button:last").click();
            expect($scope.pagination.state.pageNumber).toBe(3);
            paginator.find(".pagination button:first").click();
            expect($scope.pagination.state.pageNumber).toBe(2);
            paginator.find(".pagination button:first").click();
            expect($scope.pagination.state.pageNumber).toBe(1);
            expect(paginator.find(".pagination button:first").attr('disabled')).toBe('disabled');
        });

        it("should enable/disable pagination buttons according to paginator state", function () {
            expect(paginator.find(".pagination button:first")[0].getAttribute('disabled')).toBe('disabled');
            expect(paginator.find(".pagination button:last")[0].getAttribute('disabled')).toBe(null);

            paginator.find(".pagination button:last").click();
            paginator.find(".pagination button:last").click();
            expect(paginator.find(".pagination button:first")[0].getAttribute('disabled')).toBe(null);
            expect(paginator.find(".pagination button:last")[0].getAttribute('disabled')).toBe('disabled');

            paginator.find(".pagination button:first").click();
            paginator.find(".pagination button:first").click();
            expect(paginator.find(".pagination button:first")[0].getAttribute('disabled')).toBe('disabled');
            expect(paginator.find(".pagination button:last")[0].getAttribute('disabled')).toBe(null);
        });

        it("should let the user select the items per page", function () {

            expect(itemsPerPageSelect.length).toBe(1);

            expect(options.length).toBe($scope.pageSizeOptions.length);
            $scope.pageSizeOptions.push(1000000);
            $scope.$digest();
            options = itemsPerPageSelect.find('option');
            expect(options.length).toBe($scope.pageSizeOptions.length);

            jQuery(options[4]).prop('selected', true);
            itemsPerPageSelect.triggerHandler('change');
            $scope.$digest();
            expect($scope.pagination.state.pageSize).toBe(1000000);

        });

        it("should have a link to the last page", function () {
            var pageNumberInput = paginator.find('input');
            expect(pageNumberInput.val()).toBe('1');
            expect(pageNumberInput.attr('max')).toBe('3');

            $scope.pagination.setTotalItems(12345678);
            $scope.$digest();

            expect(pageNumberInput.attr('max')).toBe('493828');
            var lastPageLink = paginator.find('a.last-page-link');

            expect(lastPageLink.text()).toContain('493,828');
            lastPageLink.click();
            $scope.$digest();

            expect($scope.pagination.state.pageNumber).toBe(493828);
        });

        it("should do fancy math with the page number when you change the page size in the middle of the list", function () {
            $scope.pagination.setTotalItems(12345678);
            $scope.$digest()

            expect($scope.pagination.state.pageNumber).toBe(1);
            expect($scope.pagination.state.startIndex).toBe(0);
            expect($scope.pagination.state.endIndex).toBe(25);

            nextButton.click();
            expect($scope.pagination.state.pageNumber).toBe(2);
            expect($scope.pagination.state.startIndex).toBe(25);
            expect($scope.pagination.state.endIndex).toBe(50);

            nextButton.click();
            expect($scope.pagination.state.pageNumber).toBe(3);
            expect($scope.pagination.state.startIndex).toBe(50);
            expect($scope.pagination.state.endIndex).toBe(75);

            jQuery(options[3]).prop('selected', true);
            itemsPerPageSelect.triggerHandler('change');
            $scope.$digest();
            expect($scope.pagination.state.pageSize).toBe(100);
            expect($scope.pagination.state.pageNumber).toBe(2);
            expect($scope.pagination.state.startIndex).toBe(50);
            expect($scope.pagination.state.endIndex).toBe(150);

            nextButton.click();
            expect($scope.pagination.state.pageNumber).toBe(3);
            expect($scope.pagination.state.startIndex).toBe(150);
            expect($scope.pagination.state.endIndex).toBe(250);

            prevButton.click();
            expect($scope.pagination.state.pageNumber).toBe(2);
            expect($scope.pagination.state.startIndex).toBe(50);
            expect($scope.pagination.state.endIndex).toBe(150);

            prevButton.click();
            expect($scope.pagination.state.pageNumber).toBe(1);
            expect($scope.pagination.state.startIndex).toBe(0);
            expect($scope.pagination.state.endIndex).toBe(100);

            expect(prevButton.attr('disabled')).toBe('disabled');
        });

        it("should stop users from entering page numbers that are outside the range", function () {

            expect(pageNumberInput.val()).toBe('1');
            expect(pageNumberInput.attr('max')).toBe('3');

            $scope.pagination.setTotalItems(12345678);
            $scope.$digest();

            expect(pageNumberInput.attr('max')).toBe('493828');

            pageNumberInput.val('123');
            pageNumberInput.triggerHandler('change');
            $scope.$digest();
            $timeout.flush();

            expect($scope.pagination.state.pageNumber).toBe(123);

            pageNumberInput.val('-123');
            pageNumberInput.triggerHandler('change');
            $scope.$digest();
            $timeout.flush();

            expect($scope.pagination.state.pageNumber).toBe(123);

            pageNumberInput.val('500000');
            pageNumberInput.triggerHandler('change');
            $scope.$digest();
            $timeout.flush();

            expect($scope.pagination.state.pageNumber).toBe(123);

            pageNumberInput.val('9373');
            pageNumberInput.triggerHandler('change');
            $scope.$digest();
            $timeout.flush();

            expect($scope.pagination.state.pageNumber).toBe(9373);
        });

        it("should have an method to set page", function () {
            expect(angular.isFunction($scope.pagination.setPageNumber)).toBe(true);

            $scope.pagination.setPageNumber(36);
            $scope.$digest();

            expect($scope.pagination.state.pageNumber).toBe(36);

        });

        it("should have an method to set size", function () {
            expect(angular.isFunction($scope.pagination.setPageSize)).toBe(true);

            $scope.pagination.setPageSize(100);
            $scope.$digest();

            expect($scope.pagination.state.pageSize).toBe(100);

        });

        it("should have a way to watch for changes", function () {
            // make sure a worthless change event wasn't sent
            expect($scope.onChange).not.toHaveBeenCalled();

            $scope.onChange.calls.reset();

            expect(lastPageLink.text()).toContain('3');
            lastPageLink.click();
            $scope.$digest();
            var lastPageChangeArgs = $scope.onChange.calls.mostRecent().args;
            expect(lastPageChangeArgs[0].endIndex).toBe(60);

            $scope.onChange.calls.reset();
            var pageNumberInput = paginator.find('input');
            expect(pageNumberInput.val()).toBe('3');
            pageNumberInput.val('2');
            pageNumberInput.triggerHandler('change');
            $scope.$digest();
            $timeout.flush();

            lastPageChangeArgs = $scope.onChange.calls.mostRecent().args;
            var secondPageChange = { pageNumber: 3, startIndex: 50, endIndex: 60, pageSize: 25, totalItems: 60, totalPages: 3 };
            expect(lastPageChangeArgs[1]).toEqual(secondPageChange);
        });

        it("should jump to the previous page if you delete everything off the page you are on", function () {
            $scope.pagination.setTotalItems(26);
            $scope.$digest();

            expect($scope.pagination.state.startIndex).toBe(0);
            expect($scope.pagination.state.endIndex).toBe(25);

            lastPageLink = paginator.find('a.last-page-link');
            expect(lastPageLink.text()).toContain('2');
            lastPageLink.click();
            $scope.$digest();

            expect($scope.pagination.state.startIndex).toBe(25);
            expect($scope.pagination.state.endIndex).toBe(26);

            expect(prevButton[0].getAttribute('disabled')).toBe(null);
            expect(nextButton[0].getAttribute('disabled')).toBe('disabled');

            //something go deleted and I set the size smaller:
            $scope.pagination.setTotalItems(25);
            $scope.$digest();

            expect($scope.pagination.state.startIndex).toBe(0);
            expect($scope.pagination.state.endIndex).toBe(25);

            expect(prevButton[0].getAttribute('disabled')).toBe('disabled');
            expect(nextButton[0].getAttribute('disabled')).toBe('disabled');

        });

        it("should keep you in the same place, even if you adjust the page size on a partial last page", function () {
            // weird use case but here it goes:
            // If you've got 78 results, and page to the end at 25 per page,
            // get to that last page and only see 3 rows, then try to see 100 per page,
            // we won't send you back to page one and show you everything.
            // You need to go back to page 1 to see that
            // and we need to make sure you get that opportunity and don't go hiding ourselves.
            $scope.pagination.setTotalItems(78);
            $scope.$digest();

            expect($scope.pagination.state.startIndex).toBe(0);
            expect($scope.pagination.state.endIndex).toBe(25);
            lastPageLink.click();
            $scope.$digest();
            expect($scope.pagination.state.pageNumber).toBe(4);
            expect($scope.pagination.state.startIndex).toBe(75);
            expect($scope.pagination.state.endIndex).toBe(78);

            jQuery(options[3]).prop('selected', true);
            itemsPerPageSelect.triggerHandler('change');
            $scope.$digest();
            expect($scope.pagination.state.pageSize).toBe(100);
            expect($scope.pagination.state.startIndex).toBe(75);
            expect($scope.pagination.state.endIndex).toBe(78);
            expect($scope.pagination.state.pageNumber).toBe(2);

            prevButton.click();
            $scope.$digest();

            // there's no next page to go to anymore
            expect(paginator.find(".pagination button:first")[0].getAttribute('disabled')).toBe('disabled');
            expect(paginator.find(".pagination button:last")[0].getAttribute('disabled')).toBe('disabled');

        });
    });

    describe('search parameter support', function(){

        beforeEach(function () {
            inject(function ($injector) {
                $compile = $injector.get('$compile');
                $timeout = $injector.get('$timeout');
            });
        });

        it('should use initial values from searchParams', function(){
            $scope.searchParams = {page: 2, page_size: 100};
            $scope.onReady = function (api) {
                expect(api.state.pageNumber).toEqual(2);
                expect(api.state.pageSize).toEqual(100);
            }
            compileDirective();
        });

        it('should update state when searchParams change', function(){
            $scope.pagination = {};
            $scope.searchParams = {page: 1, page_size: 25};
            compileDirective();
            $scope.searchParams = {page: 3, page_size: 150};
            $scope.$digest();
            expect($scope.pagination.state.pageNumber).toEqual(3);
        });

        it('should update searchParams.page when page number changes', function(){
            $scope.pagination = {};
            $scope.searchParams = {page: 1, page_size: 25};
            compileDirective();
            $scope.pagination.nextPage();
            $scope.$digest();
            expect($scope.searchParams.page).toEqual('2');
        });

        it('should update searchParams.page_size when page size changes', function(){
            $scope.pagination = {};
            $scope.searchParams = {page: 1, page_size: 25};
            compileDirective();
            $scope.pagination.setPageSize(100)
            $scope.$digest();
            expect($scope.searchParams.page_size).toEqual('100');
        });

    });

});
