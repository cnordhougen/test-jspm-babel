var angular = require('angular');

require('/core/all');

var DemoController = require('./pagination-footer.example.ctrl');

module.exports = angular
    .module('PaginationFooterExample', ['webui-core'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('theDemo', {
                url: '/',
                templateUrl: 'pagination-footer.example.view.html',
                data: {
                    title: 'Demo'
                }
            });

    })
    .run(['$state', function ($state) {
        $state.transitionTo('theDemo');
    }])
    .controller('PaginationFooterExampleCtrl', DemoController);
