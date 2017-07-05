var angular = require('angular');

module.exports = angular
    .module('identityExample', [require('webui-core').name])
    .controller('AppController', AppController)
    .config(function (identityServiceProvider) {

        // Optionally, if you know the specific environment you want
        // to use, you can set the identity env during config phase.

        identityServiceProvider.setEnv('stage');

    });

AppController.$inject = ['$scope', '$http', 'tokenService', 'commercePlatform', 'identityService'];

function AppController($scope, $http, tokenService, commercePlatform, identityService) {

    var _this = this;

    this.result = {};
    this.waiting = false;
    this.token = tokenService.token;
    this.env = identityService.getEnv();
    this.setEnv = identityService.setEnv;

    // If your app is not running in Commerce Platform, then it
    // will not be able to auto detect which environment to use
    // for Identity. In such an instance, catch getEnvironment()
    // and setup the env manually.

    commercePlatform.getEnvironment().catch(function () {

        console.warn('Application is not running in Commerce Platform');
        identityService.setUrl('https://local.identity/');
        identityService.ready();

    });

    $scope.$watch(function () {

        // This isn't necessary for using Identity Service,
        // it just keeps our form up to date with the env
        // settings as they change.

        return identityService.getEnv();

    }, function (newVal) {

        _this.env = newVal;

    });

    this.whoami = function () {

        _this.waiting = true;
        _this.result = {};
        identityService.whoami().then(function (result) {

            _this.result.success = result;
            console.log(result);

        }).catch(function (err) {

            _this.result.error = err;
            console.warn(err);

        }).finally(function () {

            _this.waiting = false;

        });

    };

}
