require('test/harness');
require('./token.module');
var Provider = require('./token.service.provider');

describe('modules/token/token.service', function () {

    var $http;
    var $window;
    var $injector;
    var $rootScope;
    var $httpBackend;
    var $httpProvider;
    var $windowOrig;

    var service;
    var provider;

    afterEach(function () {
        service = null;
        provider = null;
        $window = $windowOrig;
        sessionStorage.clear();
    });

    beforeEach(function(){

        angular.mock.module(function ($provide) {
            $provide.value('currentUser', require('webui-core/modules/currentUser/currentUser.mock'));
            $provide.value('identityService', require('webui-core/modules/identity/identity.service.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });

        angular.mock.module(function ($provide, _$injector_, _$httpProvider_) {

            $injector = _$injector_;
            $httpProvider = _$httpProvider_;
            $windowOrig = angular.injector(['ng']).get('$window');

            $provide.constant('$window', {
                location: {href: window.location.href},
                document: window.document
            });
        });

        angular.mock.module('spsui.token', function(tokenServiceProvider) {
            provider = tokenServiceProvider;
        });

        inject(function (_$http_, _$window_, _$rootScope_, _$httpBackend_, _$injector_) {
            $http = _$http_;
            $window = _$window_;
            $injector = _$injector_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
        });
    });


    function getService() {
        service = $injector.get('tokenService');
        return service;
    }

    describe('provider', function () {

        it('should have injectAuthHeader method', function () {
            expect(provider).toHaveMethod('injectAuthHeader');
        });

    });

    describe('tokenService', function () {

        it('should have empty token property', function () {
            getService();
            expect(service).toHaveEmptyString('token');
        });

        it('should capture the token from the sessionStorage', function () {
            sessionStorage.setItem('token', 'ABC123');
            getService();
            expect(service.token).toBe('ABC123');
        });

    });

    describe('tokenInjector', function () {

        var tokenInjector = require('./token.injector');

        it('should attach the token injector interceptor', function () {
            getService();
            expect($httpProvider.interceptors).toContain(tokenInjector);
        });

        it('should not attach header by default', function (done) {
            sessionStorage.setItem('token', 'ABC123');
            getService();
            $httpBackend.expect('GET', '/', null, function (headers) {
                return !expect(headers.AUTHORIZATION).toBeUndefined();
            }).respond(200, {});
            $http.get('/').finally(done);
            $httpBackend.flush();
        });

        it('should attach header if injectAuthHeader(true)', function (done) {
            sessionStorage.setItem('token', 'ABC123');
            provider.injectAuthHeader(true);
            getService();
            $httpBackend.expect('GET', '/', null, function (headers) {
                return !expect(headers.AUTHORIZATION).toBe('Bearer ABC123');
            }).respond(200, {});
            $http.get('/').finally(done);
            $httpBackend.flush();
        });

        it('should attach header if injectAuthHeader(false) and useToken:true', function(done) {
            sessionStorage.setItem('token', 'ABC123');
            provider.injectAuthHeader(false);
            getService();
            $httpBackend.expect('GET', '/', null, function (headers) {
                return !expect(headers.AUTHORIZATION).toBe('Bearer ABC123');
            }).respond(200, {});
            $http.get('/', {useToken: true}).finally(done);
            $httpBackend.flush();
        });

        it('should not attach header if injectAuthHeader(true) and useToken:false', function(done) {
            sessionStorage.setItem('token', 'ABC123');
            provider.injectAuthHeader(true);
            getService();
            $httpBackend.expect('GET', '/', null, function (headers) {
                return !expect(headers.AUTHORIZATION).toBeUndefined();
            }).respond(200, {});
            $http.get('/', {useToken: false}).finally(done);
            $httpBackend.flush();
        });
    });
});
