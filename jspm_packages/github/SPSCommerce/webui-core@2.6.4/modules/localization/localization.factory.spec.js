require('test/harness');

var _ = require('lodash');
var Factory = require('./localization.factory');

describe('modules/localization/localization.factory', function () {

    var $q;
    var $log;
    var $http;
    var $httpBackend;
    var commercePlatform;

    var url;
    var spyThen;
    var spyCatch;
    var factory;
    var localization;
    var Localization;

    const BASE_LANGUAGE_URL = 'https://cdn.spsc.io/framework/i18n/';
    const BASE_VERSION_URL = 'https://s3.amazonaws.com/static-assets.spscommerce.com/framework/i18n/';

    beforeEach(function() {
        spyThen = jasmine.createSpy('then');
        spyCatch = jasmine.createSpy('catch');
    });

    beforeEach(function() {

        angular.mock.module(function ($provide) {
            $provide.value('commercePlatform', require('webui-core/modules/commercePlatform/commercePlatform.mock'));
        });

        inject(function (_$q_, _$log_, _$http_, _$httpBackend_, _commercePlatform_) {
            $q = _$q_;
            $log = _$log_;
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            commercePlatform = _commercePlatform_;
            Localization = new Factory($q, $log, $http, commercePlatform);
        });

    });

    afterEach(function () {
        url = null;
        spyThen = null;
        spyCatch = null;
        factory = null;
        localization = null;
        Localization = null;
    });

    describe('Factory', function () {

        it('should return Localization constructor', function () {
            expect(Localization).toBeFunction();
        });

        it('should not throw when creating Localization instance', function () {
            expect(function () {
                localization = new Localization();
            }).not.toThrow();
        });

    });

    describe('Localization', function () {

        beforeEach(function () {
            localization = new Localization();
        });

        describe('getId()', function () {

            it('should have getId() static method', function () {
                expect(Localization.getId).toBeFunction();
            });

            it('should return string from params', function () {
                var result = Localization.getId('foo', 'bar');
                expect(result).toBe('foo-bar');
            });

            it('should return uniqueIds even if params are blank', function () {
                var spyUid = spyOn(_, 'uniqueId').and.returnValue('foo');
                var result = Localization.getId();
                expect(spyUid).toHaveBeenCalledTimes(2);
                expect(result).toBe('foo-foo');
            });
        });

        describe('whenReady()', function () {

            var spyEnv;
            var spyVer;
            var spyPath;
            var spyInit;

            beforeEach(function() {
                spyEnv = spyOn(localization, 'getEnvironment').and.returnValue(window.$q.resolve('foo'));
                spyVer = spyOn(localization, 'getVersion').and.returnValue(window.$q.resolve('bar'));
                spyPath = spyOn(localization, 'getPath').and.returnValue(window.$q.resolve('baz'));
                spyInit = spyOn(localization, 'init').and.callThrough();
            });

            it('should call init()', function () {
                localization.whenReady();
                expect(spyInit).toHaveBeenCalledTimes(1);
            });

            it('should only call init() once', function () {
                localization.whenReady();
                localization.whenReady();
                localization.whenReady();
                expect(spyInit).toHaveBeenCalledTimes(1);
            });

            it('should return a $q promise', function () {
                var result = localization.whenReady();
                expect(result).toBeQPromise();
            });

            itAsync('should reject if getEnvironment rejects', function() {
                spyEnv.and.returnValue(window.$q.reject('foobar'));
                return localization.whenReady().then(spyThen).catch(spyCatch).finally(function(){
                    expect(spyThen).not.toHaveBeenCalled();
                    expect(spyCatch).toHaveBeenCalledTimes(1);
                });
            });

            itAsync('should reject if getVersion rejects', function() {
                spyVer.and.returnValue(window.$q.reject());
                return localization.whenReady().then(spyThen).catch(spyCatch).finally(function(){
                    expect(spyThen).not.toHaveBeenCalled();
                    expect(spyCatch).toHaveBeenCalledTimes(1);
                });
            });

            itAsync('should reject if getPath rejects', function() {
                spyPath.and.returnValue(window.$q.reject());
                return localization.whenReady().then(spyThen).catch(spyCatch).finally(function(){
                    expect(spyThen).not.toHaveBeenCalled();
                    expect(spyCatch).toHaveBeenCalledTimes(1);
                });
            });

            itAsync('should resolve if all async calls resolve', function() {
                return localization.whenReady().then(spyThen).catch(spyCatch).finally(function(){
                    expect(spyEnv).toHaveBeenCalledTimes(1);
                    expect(spyVer).toHaveBeenCalledTimes(1);
                    expect(spyPath).toHaveBeenCalledTimes(1);
                    expect(spyThen).toHaveBeenCalledTimes(1);
                    expect(spyCatch).not.toHaveBeenCalled();
                });
            });

            itAsync('should set env from getEnvironment', function() {
                return localization.whenReady().finally(function(){
                    expect(localization.env).toBe('foo');
                });
            });

            itAsync('should set version from getVersion', function() {
                return localization.whenReady().finally(function(){
                    expect(localization.version).toBe('bar');
                });
            });

            itAsync('should set path from getPath', function() {
                return localization.whenReady().finally(function(){
                    expect(localization.path).toBe('baz');
                });
            });

        });

        describe('getEnvironment()', function () {

            var spyCPGetEnv;

            beforeEach(function(){
                spyCPGetEnv = spyOn(commercePlatform, 'getEnvironment');
            });

            itAsync('should return environment from Commerce Platform', function(){
                spyCPGetEnv.and.returnValue(window.$q.resolve('foo'));
                return localization.getEnvironment().then(spyThen).catch(spyCatch).finally(function() {
                    expect(spyThen).toHaveBeenCalledWith('foo');
                    expect(spyCatch).not.toHaveBeenCalled();
                });
            });

            itAsync('should return "local" when Commerce Platform call rejects', function(){
                spyCPGetEnv.and.returnValue(window.$q.reject('foo'));
                return localization.getEnvironment().then(spyThen).catch(spyCatch).finally(function() {
                    expect(spyThen).toHaveBeenCalledWith('local');
                    expect(spyCatch).not.toHaveBeenCalled();
                });
            });

        });

        describe('getVersion()', function () {

            beforeEach(function(){
                url = BASE_VERSION_URL + 'apps/my-app/foo.json';
                localization = new Localization('app', 'my-app');
                localization.env = 'foo';
            });

            it('should return a $q promise', function() {
                var result = localization.getVersion();
                expect(result).toBeQPromise();
            });

            it('should make GET request for version file', function(){
                $httpBackend.expectGET(url).respond(200);
                localization.getVersion();
                $httpBackend.flush();
            });

            itAsync('should reject if GET for file fails', function () {
                $httpBackend.expectGET(url).respond(404);
                var result = localization.getVersion().catch(spyCatch).finally(function () {
                    expect(spyCatch).toHaveBeenCalled();
                });
                $httpBackend.flush();
                return result;
            });

            itAsync('should reject if GET for file does not return a version', function () {
                $httpBackend.expectGET(url).respond(404);
                var result = localization.getVersion().catch(spyCatch).finally(function () {
                    expect(spyCatch).toHaveBeenCalled();
                });
                $httpBackend.flush();
                return result;
            });

            itAsync('should resolve if GET returns valid JSON with version', function () {
                $httpBackend.expectGET(url).respond({version: 1});
                var result = localization.getVersion().then(spyThen).finally(function () {
                    expect(spyThen).toHaveBeenCalled();
                });
                $httpBackend.flush();
                return result;
            });

        });

        describe('getPath()', function () {

            beforeEach(function(){
                url = BASE_LANGUAGE_URL + 'apps/my-app/10';
                localization = new Localization('apps', 'my-app');
                localization.env = 'foo';
                localization.version = 10;
            });

            it('should return a $q promise', function() {
                var result = localization.getPath();
                expect(result).toBeQPromise();
            });

            itAsync('should get the fully formed localization file path', function () {
                return localization.getPath().then(function(path){
                    expect(path).toBe(url);
                })
            });

        });

    });

});
