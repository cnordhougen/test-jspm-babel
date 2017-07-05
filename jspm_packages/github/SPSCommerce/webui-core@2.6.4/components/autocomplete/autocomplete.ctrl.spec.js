require('test/harness');
var $ = require('jquery');

require('./autocomplete.module');
require('../../modules/localization');

describe('components/autocomplete/autcomplete.ctrl.js', function () {

    beforeEach(function() {
        angular.mock.module('webui-autocomplete')
        angular.mock.module('webui-localization', function ($provide) {
            $provide.value('commercePlatform', require('webui-core/modules/commercePlatform/commercePlatform.mock'));
            $provide.value('currentUser', require('webui-core/modules/currentUser/currentUser.mock'));
            $provide.value('identityService', require('webui-core/modules/identity/identity.service.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });
    });

    var $q;
    var $scope;
    var ngModel;
    var $timeout;
    var $translate;
    var $httpBackend;
    var $rootScope;
    var ngModelController;

    var Controller = require('./autocomplete.ctrl');

    var inst;
    var $input;
    var onReady;
    var onChange;
    var syncResults;
    var asyncResults;

    var testCollection1 = [{id: 1, title: 'Foo'}, {id: 2, title: 'Bar'}, {id: 3, title: 'Baz'}];
    var testCollection2 = [{id: 2, title: 'Bar'}, {id: 1, title: 'Foo'}, {id: 3, title: 'Baz'}];
    var testCollection3 = [{id: 2, title: 'Bar'}];

    beforeEach(inject(function (_$q_, _$timeout_, _$translate_, _$rootScope_, _$httpBackend_) {
        $q = _$q_;
        $timeout = _$timeout_;
        $translate = _$translate_;
        $rootScope = _$rootScope_;
        $scope =  _$rootScope_.$new();
        $httpBackend = _$httpBackend_;

        $input = $('<spsui-autocomplete/>');

        onReady = jasmine.createSpy('ctrl.onReady');
        onChange = jasmine.createSpy('ctrl.onChange');
        syncResults = jasmine.createSpy('syncResults');
        asyncResults = jasmine.createSpy('asyncResults');

        ngModel = {
            $setViewValue: jasmine.createSpy('ngModel.$setViewValue')
        };

        $httpBackend.when('GET', 'https://cdn.spsc.io/framework/i18n/components/webui-autocomplete/local.json')
            .respond({
                "version": "1"
            });

        $httpBackend.when('GET', 'https://cdn.spsc.io/framework/i18n/components/webui-autocomplete/1/en-US.json')
            .respond({
                "webui.components.autocomplete.NO_RESULTS": "No results match your search",
                "webui.components.autocomplete.SEARCHING": "Searching...",
            });

        inst = new Controller($q, $timeout, $translate, $rootScope, $scope);
        inst.setup($input, ngModel);
    }));

    describe('onReady()', function () {

        it('should not throw when missing onReady handler', function () {
            expect(inst.triggerOnReady).not.toThrow();
        });

        it('should trigger onReady callback', function () {
            inst.onReady = onReady;
            inst.triggerOnReady();
            expect(inst.onReady).toHaveBeenCalled();
        });

    });

    describe('onChange()', function () {

        it('should not throw when missing onChange handler', function () {
            var val = 'FooBarBaz';
            inst.updateModel(val);
            expect($timeout.flush).not.toThrow();
        });

        it('should set model value and trigger change', function () {
            inst.onChange = onChange;
            var val = 'FooBarBaz';
            inst.updateModel(val);
            $timeout.flush();
            expect(ngModel.$setViewValue).toHaveBeenCalledWith(val);
            expect(inst.onChange).toHaveBeenCalledWith(val);
        });

    });

    describe('updateModel()', function () {

        it('should default to modelType: string', function () {
            expect(inst.modelType).toBe('string');
        });

        it('should convert string to object when model-type is object', function () {
            var val = 'foo';
            inst.modelType = 'object';
            inst.updateModel(val);
            $timeout.flush();
            var exp = {value: val};
            expect(ngModel.$setViewValue).toHaveBeenCalledWith(exp);
        });

        it('should convert object to string when model-type is string', function () {
            var val = {id: 1, value: 'foo'};
            inst.updateModel(val);
            $timeout.flush();
            var exp = 'foo';
            expect(ngModel.$setViewValue).toHaveBeenCalledWith(exp);
        });

    });

    describe('getIdValue()', function () {

        it('should not throw when item is undefined', function () {
            inst.idKey = 'id';
            expect(inst.getIdValue).not.toThrow();
        });

        it('should get the correct item id using idKey fn', function () {
            inst.idKey = function (item) {
                return item.id;
            };
            var item = {id: 123, title: 'FooBar'};
            var result = inst.getIdValue(item);
            expect(result).toBe(String(item.id));
        });

        it('should get the correct item id using idKey str', function () {
            inst.idKey = 'id';
            var item = {id: 123, title: 'FooBar'};
            var result = inst.getIdValue(item);
            expect(result).toBe(String(item.id));
        });

        it('should default id key to "id"', function () {
            var item = {id: 123, title: 'FooBar'};
            var result = inst.getIdValue(item);
            expect(result).toBe(String(item.id));
        });

    });

    describe('getTextValue()', function () {

        it('should not throw when item is undefined', function () {
            inst.textKey = 'title';
            expect(inst.getTextValue).not.toThrow();
        });

        it('should return item if item is already a string', function () {
            var item = 'foobar';
            var result = inst.getTextValue(item);
            expect(result).toBe(item);
        });

        it('should return String(item) if formatter is unknown type', function () {
            inst.textKey = 1 / 0; // invalid key type
            var item = {foo: 'foobar'};
            var result = inst.getTextValue(item);
            expect(result).toBe(String(item));
        });

        it('should get the correct value using textKey fn', function () {
            inst.textKey = function (item) {
                return item.title;
            };
            var item = {id: 123, title: 'FooBar'};
            var result = inst.getTextValue(item);
            expect(result).toBe(item.title);
        });

        it('should get the correct value using textKey str', function () {
            inst.textKey = 'title';
            var item = {id: 123, title: 'FooBar'};
            var result = inst.getTextValue(item);
            expect(result).toBe(item.title);
        });

        it('should use default text key "value" if not specified', function () {
            var item = {id: 123, value: 'FooBar'};
            var result = inst.getTextValue(item);
            expect(result).toBe(String(item.value));
        });

    });

    describe('sortExactMatchFirst()', function () {

        it('should sort exact matches first with using textKey fn', function () {
            inst.textKey = function (item) {
                return item.title;
            };
            var result = inst.sortExactMatchFirst('Bar', testCollection1);
            expect(result).toEqual(testCollection2);
        });

        it('should sort exact matches first with using textKey str', function () {
            inst.textKey = 'title';
            var result = inst.sortExactMatchFirst('Bar', testCollection1);
            expect(result).toEqual(testCollection2);
        });

        it('should sort exact matches first with missing textKey attr', function () {
            var arr1 = ['Foo', 'Bar', 'Baz'];
            var arr2 = ['Bar', 'Foo', 'Baz'];
            var result = inst.sortExactMatchFirst('Bar', arr1);
            expect(result).toEqual(arr2);
        });

    });

    describe('addUserInputOption()', function () {

        it('should return collection if allowUserInput is false', function () {
            inst.allowUserInput = false;
            var result = inst.addUserInputOption('Bazzle', testCollection1);
            expect(result).toEqual(testCollection1);
        });

        it('should not throw if collection is undefined', function () {
            inst.allowUserInput = true;
            expect(inst.addUserInputOption).not.toThrow();
        });

        it('should prepend custom suggestion if it is not already first', function () {
            inst.allowUserInput = true;
            var arr = [{id: 1, value: 'Foo'}];
            var exp = [{value: 'Bazzle'}, {id: 1, value: 'Foo'}];
            var result = inst.addUserInputOption('Bazzle', arr);
            expect(result).toEqual(exp);
        });

        it('should not prepend custom suggestion if it is already first', function () {
            inst.allowUserInput = true;
            var arr = [{id: 2, value: 'Bazzle'}, {id: 1, value: 'Foo'}];
            var result = inst.addUserInputOption('Bazzle', arr);
            expect(result).toEqual(arr);
        });

    });

    describe('simpleTextSearch()', function () {

        it('should perform case-insensitive array reduction', function () {
            var arr1 = [{value: 'FOO'}, {value: 'BAR'}, {value: 'BAZ'}];
            var arr2 = [{value: 'BAR'}, {value: 'BAZ'}];
            var result = inst.simpleTextSearch('ba', arr1);
            expect(result).toEqual(arr2);
        });

        it('should utilize textKey if one is specified', function () {
            inst.textKey = 'name';
            var arr1 = [{name: 'FOO'}, {name: 'BAR'}, {name: 'BAZ'}];
            var arr2 = [{name: 'BAR'}, {name: 'BAZ'}];
            var result = inst.simpleTextSearch('ba', arr1);
            expect(result).toEqual(arr2);
        });

        it('should support array of strings', function () {
            var arr1 = ['FOO', 'BAR', 'BAZ'];
            var arr2 = [{value: 'BAR'}, {value: 'BAZ'}];
            var result = inst.simpleTextSearch('ba', arr1);
            expect(result).toEqual(arr2);
        });

        it('should ignore unsupported item types', function () {
            var arr1 = ['FOO', 'BAR', 'BAZ', 1/0];
            var arr2 = [{value: 'BAR'}, {value: 'BAZ'}];
            var result = inst.simpleTextSearch('ba', arr1);
            expect(result).toEqual(arr2);
        });

        it('should use simpleTextSearch for array sources', function (done) {
            inst.debounce = 0;
            inst.textKey = 'title';
            inst.source = testCollection1;
            var source = inst.getSource();
            source('Bar', syncResults, asyncResults);
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalledWith(testCollection3);
                done();
            });
        });
    });

    describe('debounce', function () {

        it('should set debounce to 300ms for fn sources', function (done) {
            inst.source = jasmine.createSpy('ctrl.source');
            var source = inst.getSource();
            // Call it a couple times.
            source('foobar', syncResults, asyncResults);
            source('foobar', syncResults, asyncResults);
            expect(asyncResults).not.toHaveBeenCalled();
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalled();
                done();
            }, 310);
        });

        it('should support custom debounce value', function (done) {
            inst.debounce = 10;
            inst.source = jasmine.createSpy('ctrl.source');
            var source = inst.getSource();
            // Call it a couple times.
            source('foobar', syncResults, asyncResults);
            source('foobar', syncResults, asyncResults);
            expect(asyncResults).not.toHaveBeenCalled();
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalled();
                done();
            }, 50);
        });

    });

    describe('sources', function () {

        it('should support a function source that returns an array', function (done) {
            inst.debounce = 0;
            inst.textKey = 'title';
            inst.source = function () {
                return testCollection1;
            };
            var source = inst.getSource();
            source('Bar', syncResults, asyncResults);
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalledWith(testCollection3);
                done();
            }, 10);
        });

        it('should support a function source that returns a promise', function (done) {
            inst.debounce = 0;
            inst.textKey = 'title';
            inst.source = function (query) {
                return new Promise(function (resolve) {
                    resolve(testCollection1);
                });
            };
            var source = inst.getSource();
            source('Bar', syncResults, asyncResults);
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalledWith(testCollection3);
                done();
            }, 10);
        });

        it('should support an array collection source', function (done) {
            inst.debounce = 0;
            inst.textKey = 'title';
            inst.source = testCollection1;
            var source = inst.getSource();
            source('Bar', syncResults, asyncResults);
            setTimeout(function () {
                expect(asyncResults).toHaveBeenCalledWith(testCollection3);
                done();
            }, 10);
        });

    });

    describe('unwatch', function () {

        it('should remove the listener when destroyed', function() {
            spyOn(inst, 'setTemplateTranslation');
            $scope.$destroy();
            $rootScope.$emit('$translateChangeSuccess', {language:'keys'})
            expect(inst.setTemplateTranslation).not.toHaveBeenCalled();
        });

    });

});
