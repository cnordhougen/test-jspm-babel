require('test/harness');
var Service = require('./currentUser.service');

describe('modules/currentUser/currentUser.service', function () {

    var $q;
    var $log;
    var service;
    var $rootScope;
    var $httpBackend;
    var tokenService;
    var identityService;
    var messageBus;

    afterEach(function () {
        service = null;
    });

    beforeEach(function(){

        angular.mock.module(function ($provide) {
            $provide.value('tokenService', require('webui-core/modules/token/token.service.mock'));
            $provide.value('identityService', require('webui-core/modules/identity/identity.service.mock'));
            $provide.value('messageBus', require('webui-core/messaging/messageBus/messageBus.mock'));
        });

        inject(function (_$q_, _$log_, _$rootScope_, _$httpBackend_, _tokenService_, _identityService_, _messageBus_) {
            $q = _$q_;
            $log = _$log_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            tokenService = _tokenService_;
            identityService = _identityService_;
            messageBus = _messageBus_;
            service = new Service($q, $log, tokenService, identityService, messageBus);
        });
    });


    it('should have details property', function(){
        expect(service).toHaveObject('details');
    });

    it('should have token property', function(){
        expect(service).toHaveString('token');
    });

    it('should have whoami method', function(){
        expect(service).toHaveMethod('whoami');
    });

    it('should have blank default preferences', function(){
        expect(service.details).toHaveObject('preferences');
        expect(service.details.preferences).toEqual({
            language: [],
            locale: '',
            timezone: ''
        });
    });

    it('should populate details with whoami() results', function(done) {
        var data = {foo: 1, bar: 2};
        service.token = 'ABC123';
        spyOn(identityService, 'whoami').and.returnValue(Promise.resolve(data));
        service.whoami().then(function(details){
            expect(service.details.foo).toBe(1);
            expect(service.details.bar).toBe(2);
            done();
        });
        $rootScope.$digest();
    });

});
