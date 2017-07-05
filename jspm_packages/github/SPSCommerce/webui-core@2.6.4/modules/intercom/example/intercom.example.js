var angular = require('angular');

module.exports = angular
    .module('intercomExample', [
        require('webui-core').name,
        require('webui-core/modules/intercom').name
    ])
    .controller('AppController', AppController)
    .config(function (intercomServiceProvider) {

        // Configure Intercom using intercomServiceProvider.config()
        // The app_id must be set by the user, all other required settings
        // are configured by including the module into your application.

        // The ID below is for the Commerce Platform TEST app

        intercomServiceProvider.config({app_id: 'svt2pdkz'});
    });

AppController.$inject = ['$scope', 'intercomService'];

function AppController($scope, intercomService) {

    var _this = this;

    this.state = {
        ready: false,
        showing: false
    };

    /**
     * Example of using the whenReady() method to wait until
     * IntercomIO is loaded and booted up.
     */
    intercomService.whenReady().then(function(){
        $scope.$applyAsync(function() {
            _this.state.ready = true;
        });
    });

    /**
     * Example of how you can hook into the Intercom events.
     */
    intercomService.api('onShow', function(){
        $scope.$applyAsync(function() {
            _this.state.showing = true;
        });
    });

    /**
     * Example of how you can hook into the Intercom events.
     */
    intercomService.api('onHide', function(){
        $scope.$applyAsync(function() {
            _this.state.showing = false;
        });
    });

    /**
     * Example of how you can show the message window from your own code.
     */
    this.show = function() {
        intercomService.api('show');
    };

    /**
     * Example of how you can hide the message window from your own code.
     */
    this.hide = function() {
        intercomService.api('hide');
    };


}
