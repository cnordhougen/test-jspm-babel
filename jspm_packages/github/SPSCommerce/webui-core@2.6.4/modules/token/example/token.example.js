
module.exports = require('angular')
    .module('tokenExample', [require('webui-core').name])
    .controller('AppController', AppController)
    .config(function (tokenServiceProvider) {

        console.log('tokenServiceProvider', tokenServiceProvider);

        // disable this line and the token should not inject
        tokenServiceProvider.injectAuthHeader(true);

    });

AppController.$inject = ['$http', 'tokenService'];

function AppController($http, tokenService) {

    var _this = this;

    this.error = '';
    this.token = tokenService.token || '';
    this.global = tokenService.injectAuthHeader ? 'enabled' : 'disabled';

    this.msg = {
        attached: 'Authorization header was attached to request',
        missing: 'Authorization header was not attached to request'
    };

    this.test1 = {
        error: '',
        tested: false,
        attached: false
    };

    this.test2 = {
        error: '',
        tested: false,
        attached: false
    };

    this.test3 = {
        error: '',
        tested: false,
        attached: false
    };

    this.requestTest1 = function () {
        $http.get('./token.example.html').then(function (response) {
            _this.test1.attached = Boolean(response.config.headers.AUTHORIZATION);
        }).catch(function (error) {
            _this.test1.error = error;
        }).finally(function () {
            _this.test1.tested = true;
        });
    };

    this.requestTest2 = function () {
        $http.get('./token.example.html', {useToken: true}).then(function (response) {
            _this.test2.attached = Boolean(response.config.headers.AUTHORIZATION);
        }).catch(function (error) {
            _this.test2.error = error;
        }).finally(function () {
            _this.test2.tested = true;
        });
    };

    this.requestTest3 = function () {
        $http.get('./token.example.html', {useToken: false}).then(function (response) {
            _this.test3.attached = Boolean(response.config.headers.AUTHORIZATION);
        }).catch(function (error) {
            _this.test3.error = error;
        }).finally(function () {
            _this.test3.tested = true;
        });
    };

}
