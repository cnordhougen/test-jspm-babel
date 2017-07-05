require('test/harness');
require('./intercom.module');

describe('modules/identity/intercom.service', function () {

    var $q;
    var $http;
    var $injector;
    var $rootScope;
    var $httpBackend;

    var service;
    var provider;
    var currentUser;

    var defaults = {
        app_id: 'svt2pdkz',
        url: 'https://widget.intercom.io/widget/'
    };

    afterEach(function () {
        service = null;
        provider = null;
        window.Intercom = null;
    });

    beforeEach(function () {

        window.Intercom = null;

        angular.mock.module(function ($provide) {
            $provide.value('currentUser', require('webui-core/modules/currentUser/currentUser.mock'));
        });

        angular.mock.module('webui-intercom', function (intercomServiceProvider) {
            provider = intercomServiceProvider;
        });

        inject(function (_$q_, _$rootScope_, _$injector_, _$httpBackend_, _currentUser_) {
            $q = _$q_;
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            currentUser = _currentUser_;
            $httpBackend = _$httpBackend_;
        });

    });

    function getService() {
        return $injector.get('intercomService');
    }

    describe('provider', function () {

        it('should have config()', function () {
            expect(provider).toHaveMethod('config');
        });

        it('should have setUrl()', function () {
            expect(provider).toHaveMethod('setUrl');
        });

        it('should have whenReady()', function () {
            expect(provider).toHaveMethod('whenReady');
        });

        it('should set window.Intercom', function () {
            expect(window.Intercom).toBeFunction();
            expect(window.Intercom).not.toThrow();
        });

    });

    describe('intercomService', function () {

        beforeEach(function () {
            service = getService();
        });

        it('should have api()', function () {
            expect(service).toHaveMethod('api');
        });

        it('should have config()', function () {
            expect(service).toHaveMethod('config');
        });

        it('should have setUrl()', function () {
            expect(service).toHaveMethod('setUrl');
        });

        it('should have launch()', function () {
            expect(service).toHaveMethod('launch');
        });

        it('should have whenReady()', function () {
            expect(service).toHaveMethod('whenReady');
        });

        it('should reject launched without app_id', function (done) {
            var spy = jasmine.createSpy('catch');
            service.launch().catch(spy);
            $rootScope.$digest();
            expect(spy).toHaveBeenCalled();
            done();
        });

        it('should reject if launched without user_id', function (done) {
            var spy = jasmine.createSpy('catch');
            service.config({app_id: defaults.app_id});
            service.launch().catch(spy);
            $rootScope.$digest();
            expect(spy).toHaveBeenCalled();
            done();
        });

        it('should resolve launch() on load of the library', function (done) {
            service.config({app_id: defaults.app_id, user_id: 'bar'});
            service.launch().then(function (service) {
                expect(service).toBeObject();
            }).catch(function (err) {
                console.log(err.target);
                fail('expected promise to resolve, rejected instead');
            }).finally(done);
            $rootScope.$digest();
        });

        it('should reject launch() if libary load fails', function (done) {
            service.setUrl('foo://bar/'); // nasty bad url
            service.config({app_id: defaults.app_id, user_id: 'bar'});
            service.launch().then(function () {
                fail('expected promise to reject, resolved instead');
            }).catch(function (err) {
                expect(err).toBeString();
            }).finally(done);
            $rootScope.$digest();
        });

        it('should resolve whenReady after script load', function (done) {
            var spy = jasmine.createSpy('whenReady.then');
            service.whenReady().then(spy).finally(function(){
                expect(spy).toHaveBeenCalled();
                done();
            });
            service.config({app_id: 'foo', user_id: 'bar'});
            service.launch();
            $rootScope.$digest();
        });

    });

});
