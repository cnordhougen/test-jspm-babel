require('test/harness');
require('./page-nav');
require('../../modules/localization');

describe('components/page-nav/page-nav.service.js', function () {

    var pageNavService, items;

    beforeEach(function() {
        angular.mock.module('spsui.pagenav')
        angular.mock.module('webui-localization', function ($provide) {
            $provide.value('commercePlatform', require('webui-core/modules/commercePlatform/commercePlatform.mock'));
            $provide.value('currentUser', require('webui-core/modules/currentUser/currentUser.mock'));
            $provide.value('identityService', require('webui-core/modules/identity/identity.service.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });
    });

    beforeEach(inject(function(_pageNavService_) {

        pageNavService = _pageNavService_;

        items = [
            { state: 'app.overview', name: 'Overview' },
            { state: 'env.transactions', name: 'Transactions' },
            { state: 'app.intelligence', name: 'Intelligence' },
            { state: 'app.activity', name: 'Activity' },
            { state: 'app.favorites', name: 'Favorites' },
            { url: 'http://www.google.com', name: 'Google' }]
    }));

    it('should instantiate service', function () {
        expect(pageNavService).not.toBe(null);
        expect(pageNavService).not.toBe(undefined);
    });

    it('should return an array of items passed as a params', function () {
        var result = pageNavService.setItems(items);
        expect(result).toEqual(items);
    });

    it('should add new item to array of items when called addItem with new item', function() {
        var result = pageNavService.setItems(items);
        pageNavService.addItem({name:'New', state:'new'});
        expect(result.length).toBe(7);
    });

    it('should throw an Error when called addItem without item specified', function() {
        var result = pageNavService.setItems(items);

        var action = function() {
            pageNavService.addItem();
        };

        expect(action).toThrowError('navigation menu item should be specified in order added to navigation');
    });

    it('should add new items to array of items when called addItem with new items collection', function() {
        var result = pageNavService.setItems(items);

        pageNavService.addItem([
            {name:'New 1', state:'new1'},
            {name:'New 2', state:'new2'},
            {name:'New 3', state:'new3'}
        ]);

        expect(result.length).toBe(9);

        expect(result[6].state).toBe('new1');
        expect(result[7].state).toBe('new2');
        expect(result[8].state).toBe('new3');
    });

    it('should not throw an Error when called setItems without items specified', function() {

        var action = function() {
            pageNavService.setItems();
        };

        expect(action).not.toThrowError();
    });

    it('should remove item from array of items when called removeItem with specified item index', function() {
        var result = pageNavService.setItems(items);

        pageNavService.removeItem(5);

        expect(result.length).toBe(5);
    });

    it('should remove item from array of items when called removeItem with object with the state value of existing item', function() {
        var result = pageNavService.setItems(items);

        pageNavService.removeItem({ state: 'app.intelligence' });

        expect(result.length).toBe(5);
    });

    it('should remove item from array of items when called removeItem with object with the url value of existing item', function() {
        var result = pageNavService.setItems(items);

        pageNavService.removeItem({ url: 'http://www.google.com' });

        expect(result.length).toBe(5);
    });

    it('should throw an Error when called removeItem without item or item index specified', function() {

        var action = function() {
            pageNavService.removeItem();
        };

        expect(action).toThrowError('item index or actual navigation menu item should be specified in order to be deleted');
    });

    it('should throw an Error when called removeItem with item index less then 0', function() {
        var result = pageNavService.setItems(items);

        var action = function() {
            pageNavService.removeItem(-1);
        };

        expect(action).toThrowError('item index out of menu items collection range');
    });

    it('should throw an Error when called removeItem with item index out of range of menu items collection', function() {
        var result = pageNavService.setItems(items);

        var action = function() {
            pageNavService.removeItem(10);
        };

        expect(action).toThrowError('item index out of menu items collection range');
    });

    it('should throw an Error when called removeItem with item with non existing state specified', function() {
        var result = pageNavService.setItems(items);

        var action = function() {
            pageNavService.removeItem({ state: 'nonexisting' });
        };

        expect(action).toThrowError('unable to find specified item in menu items collection');
    });

});
