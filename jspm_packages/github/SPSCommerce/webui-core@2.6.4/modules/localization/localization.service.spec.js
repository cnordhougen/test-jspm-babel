require('test/harness');

var Provider = require('./localization.service.provider');

describe('modules/localization/localization.service', function () {

    var $log;
    var $injector;
    var $translate;
    var $translatePartialLoader;
    var commercePlatform;
    var Localization;
    var messageBus;

    var service;
    var provider;

    const BASE_LANGUAGE_URL = 'https://cdn.spsc.io/framework/i18n/';
    const BASE_VERSION_URL = 'https://s3.amazonaws.com/static-assets.spscommerce.com/framework/i18n/';

    function getService() {
        return provider.$get($log, $translate, $translatePartialLoader, Localization, messageBus);
    }

    beforeEach(function(){

        angular.mock.module(function ($provide) {
            $provide.value('$translate', require('test/mocks/$translate.mock'));
            $provide.value('$translatePartialLoader', require('test/mocks/$translatePartialLoader.mock'));
            $provide.value('Localization', require('./localization.factory.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });

        inject(function (_$log_, _$translate_, _$translatePartialLoader_, _Localization_, _messageBus_) {
            $log = _$log_;
            $translate = _$translate_;
            $translatePartialLoader = _$translatePartialLoader_;
            Localization = _Localization_;
            messageBus = _messageBus_;
        });
    });

    afterEach(function() {
        provider = null;
        service = null;
    })

    describe('localizationServiceProvider', function() {

        beforeEach(function () {
            provider = new Provider();
        });

        it('should have setCloaking() method', function() {
            expect(provider).toHaveMethod('setCloaking');
        });

        it('should set service.setting.cloaking with setCloaking()', function() {
            provider.setCloaking(true);
            service = getService();
            expect(service.settings.cloaking).toBeTrue();
        });

    });

    describe('localizationService', function() {

        beforeEach(function () {
            provider = new Provider();
            service = getService();
        });

        it('should have localize() method', function() {
            expect(service).toHaveMethod('localize');
        });

        it('should have setCloaking() method', function() {
            expect(service).toHaveMethod('setCloaking');
        });

        it('should have getLocalization() method', function() {
            expect(service).toHaveMethod('getLocalization');
        });

        it('should have registerTranslationPath() method', function() {
            expect(service).toHaveMethod('registerTranslationPath');
        });

        describe('default settings', function() {

            it('should default to no cloaking', function() {
                expect(service.settings.cloaking).toBeFalse();
            });

            it('should default to UTC timezone', function() {
                expect(service.settings.timezone).toBe('UTC');
            });
            it('should default to en-US language', function() {
                expect(service.settings.language).toBe('en-US');
            });
            it('should default to en-US locale', function() {
                expect(service.settings.locale).toBe('en-US');
            });

        });

        describe('localize()', function() {

            it('should return false if no app or component options', function(){
                var instance = service.localize();
                expect(instance).toBeFalse();
            });

            it('should return Localization if app options', function() {
                var instance = service.localize({app: 'foo-bar'});
                expect(instance).toBeInstanceOf(Localization);
            });

            it('should return Localization if component options', function() {
                var instance = service.localize({component: 'foo-bar'});
                expect(instance).toBeInstanceOf(Localization);
            });

            itAsync('should register the translation path once instance is ready', function() {
                var spy = spyOn(service, 'registerTranslationPath')
                var instance = service.localize({component: 'foo-bar'});
                return instance.whenReady().finally(function(){
                    expect(spy).toHaveBeenCalledTimes(1);
                });
            });

        });

        describe('getLocalization()', function() {

            it('should return false if no instance found', function() {
                var result = service.getLocalization('foobar');
                expect(result).toBeFalse();
            });

            it('should return an app instance', function() {
                var instance = service.localize({app: 'foobar'});
                var result = service.getLocalization({app: 'foobar'});
                expect(result).toEqual(instance);
            });

            it('should return a component instance', function() {
                var instance = service.localize({component: 'foobar'});
                var result = service.getLocalization({component: 'foobar'});
                expect(result).toEqual(instance);
            });

        });

        describe('registerTranslationPath()', function() {

            it('should add path to translate partial loader', function() {
                var spy = spyOn($translatePartialLoader, 'addPart');
                service.registerTranslationPath('foobar/baz');
                expect(spy).toHaveBeenCalledWith('foobar/baz');
            });

            it('should not add path if path is falsey', function() {
                var spy = spyOn($translatePartialLoader, 'addPart');
                service.registerTranslationPath('');
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('cloakElement()', function() {

            var key;
            var elem;

            beforeEach(function(){
                key = 'foo.bar';
                elem = angular.element('<div/>');
            });

            it('should register elem by key', function(){
                service.cloakElement(key, elem);
                expect(service.cloakedElements[key]).toBeArrayOfSize(1);
                expect(service.cloakedElements[key][0]).toBe(elem);
            });

            it('should reigster multiple elements with the same key', function(){
                service.cloakElement(key, elem);
                service.cloakElement(key, elem);
                service.cloakElement(key, elem);
                expect(service.cloakedElements[key]).toBeArrayOfSize(3);
            });

            it('should add cloak class to elem', function(){
                service.cloakElement(key, elem);
                expect(elem).toHaveCssClass('cloak');
            });
        });

        describe('uncloakElement()', function() {

            var key;
            var elem;

            beforeEach(function(){
                key = 'foo.bar';
                elem = angular.element('<div/>');
                service.cloakElement(key, elem);
            });

            it('should remove cloak class', function(){
                expect(elem).toHaveCssClass('cloak');
                service.uncloakElement(elem);
                expect(elem).not.toHaveCssClass('cloak');
            });
        });

        describe('uncloakElementsByKey()', function() {

            var key1;
            var key2;
            var elem1;
            var elem2;
            var elem3;

            beforeEach(function(){
                key1 = 'foo.bar';
                key2 = 'foo.baz';
                elem1 = angular.element('<div/>');
                elem2 = angular.element('<div/>');
                elem3 = angular.element('<div/>');
                service.cloakElement(key1, elem1);
                service.cloakElement(key1, elem2);
                service.cloakElement(key2, elem3);
            });

            it('should remove cloak class from key group only', function(){
                service.uncloakElementsByKey(key1);
                expect(elem1).not.toHaveCssClass('cloak');
                expect(elem2).not.toHaveCssClass('cloak');
                expect(elem3).toHaveCssClass('cloak');
            });

            it('should unregister (delete) key group after uncloaking', function() {
                service.uncloakElementsByKey(key1);
                expect(service.cloakedElements[key1]).toBeUndefined();
                expect(service.cloakedElements[key2]).toBeArray();
            });
        });
    });
});
