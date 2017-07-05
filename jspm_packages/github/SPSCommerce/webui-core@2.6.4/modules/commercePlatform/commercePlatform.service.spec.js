require('test/harness');
var _ = require('lodash');
require('./commercePlatform.module');
var Provider = require('./commercePlatform.service.provider');

describe('modules/commercePlatform/commercePlatform.service', function () {

    var $q;
    var $log;
    var $timeout;
    var $injector;
    var $location;
    var $rootScope;
    var postMessage;
    var messageBus;

    var service;
    var provider;

    afterEach(function () {
        service = null;
        provider = null;
    });

    beforeEach(function () {

        angular.mock.module(function ($provide) {
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });

        angular.mock.module('spsui.commercePlatform', function(commercePlatformProvider) {
            provider = commercePlatformProvider;
        });

        angular.mock.inject(function (_$q_, _$log_, _$timeout_, _$injector_, _$location_, _$rootScope_, _messageBus_) {
            $q = _$q_;
            $log = _$log_;
            $timeout = _$timeout_;
            $injector = _$injector_;
            $location = _$location_;
            $rootScope = _$rootScope_;
            messageBus = _messageBus_;
        });

    });

    function getService() {
        service = $injector.get('commercePlatform');
        return service;
    }

    describe('provider', function () {

        it('should have setEnvironment method', function () {
            expect(provider).toHaveMethod('setEnvironment');
        });

        it('should have setDetectionTimeout method', function () {
            expect(provider).toHaveMethod('setDetectionTimeout');
        });

        it('should bypass auto-detection when setEnvironment is used', function(done) {
            provider.setEnvironment('dev');
            getService();
            var spy = spyOn(service, 'getAppURL');
            service.getEnvironment().then(function(env){
                expect(spy).not.toHaveBeenCalled();
                expect(env).toBe('dev');
                done();
            });
            $rootScope.$digest();
        });

        it('should use value passed in setDetectionTimeout', function() {
            provider.setDetectionTimeout(10000);
            getService();
            var spyThen = jasmine.createSpy('then');
            var spyCatch = jasmine.createSpy('catch');
            var promise = service.getAppURL().then(spyThen).catch(spyCatch);
            $timeout.flush(9000);
            $rootScope.$digest();
            expect(spyThen).not.toHaveBeenCalled();
            expect(spyCatch).not.toHaveBeenCalled();
            $timeout.flush(1005);
            $rootScope.$digest();
            expect(spyThen).not.toHaveBeenCalled();
            expect(spyCatch).toHaveBeenCalled();
        });

    });

    describe('setPageTitle()', function() {

        beforeEach(function() {
            getService();
        });

        it('should send string title if title is truthy', function(){
            var spy = spyOn(messageBus, 'send');
            service.setPageTitle('fooBar');
            expect(spy).toHaveBeenCalledWith('setPageTitle', 'fooBar');
        });

        it('should send empty string if title is falsey', function(){
            var spy = spyOn(messageBus, 'send');
            service.setPageTitle(null);
            expect(spy).toHaveBeenCalledWith('setPageTitle', '');
        });

        it('should convert title param to string', function() {
            var spy = spyOn(messageBus, 'send');
            service.setPageTitle(123);
            expect(spy).toHaveBeenCalledWith('setPageTitle', '123');
        });

    });

    describe('updateState()', function() {

        beforeEach(function() {
            getService();
        });

        it('should send postMessage with location path', function() {
            var spy = spyOn(messageBus, 'send');
            service.updateState();
            expect(spy).toHaveBeenCalledWith('appStateChange', {
                path: $location.path(),
                search: $location.search()
            });
        });
    });

    describe('getAppURL()', function () {

        beforeEach(function() {
            getService();
        });

        it('should return a $q promise', function () {
            var result = service.getAppURL();
            expect(result).toBeQPromise();
        });

        it('should immediately cache the promise', function () {
            var result1 = service.getAppURL();
            result1.uid = _.uniqueId();
            var result2 = service.getAppURL();
            expect(result1).toEqual(result2);
        });

        it('should return new promise when refreshed', function () {
            var result1 = service.getAppURL();
            result1.uid = _.uniqueId();
            var result2 = service.getAppURL(true);
            expect(result1).not.toEqual(result2);
        });

        it('should send request via messageBus', function () {
            var spy = spyOn(messageBus, 'send').and.callThrough();
            service.getAppURL();
            expect(spy).toHaveBeenCalledWith('getAppBaseUrl');
        });

        it('should resolve promise when the messageBus responds', function (done) {
            var url = 'https://foo.com/bar/123/?a=b&c=d#qaz';
            var spy = spyOn(messageBus, 'send').and.returnValue({
                onResponse: function(cb) { cb(url); }
            });
            service.getAppURL().then(function (resp) {
                expect(resp).toBe(url);
                done();
            });
            $rootScope.$digest();
        });

        it('should reject promise if no reponse in 5000ms', function () {
            var spyThen = jasmine.createSpy('then');
            var spyCatch = jasmine.createSpy('catch');
            var promise = service.getAppURL().then(spyThen).catch(spyCatch);
            $timeout.flush(5005);
            $rootScope.$digest();
            expect(spyThen).not.toHaveBeenCalled();
            expect(spyCatch).toHaveBeenCalled();
        });

        it('should reject promise if URL is not provided', function (done) {
            var spy = spyOn(messageBus, 'send').and.returnValue({
                onResponse: function(cb) { cb(false); }
            });
            service.getAppURL().catch(function (err) {
                expect(err).toBeString();
                done();
            });
            $rootScope.$digest();
        });

    });


});
