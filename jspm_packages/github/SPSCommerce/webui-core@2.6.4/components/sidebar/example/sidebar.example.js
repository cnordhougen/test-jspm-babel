
var angular = require('angular');

require('/core/all');


function pageTitleService(){
    return {
        pageTitle: 'Default Title',
        showBack:false,
        backFunction: function() {}
    };
}

var DemoController = require('./sidebar.example.ctrl');
var SidebarAppPrefsCtrl = require('./sidebar.example.app.prefs.ctrl');

DemoController.$inject = ['$state','sidebarService', 'pageTitleService'];

module.exports = angular
    .module('SidebarExample', ['webui-core'])
    .config(function($stateProvider){
        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'views/dashboard.html',
            controller: 'SidebarExampleCtrl',
            controllerAs: 'ctrl',
            data: {
                title: 'Dashboard'
            }
        })
            .state('favorites', {
                url: '/favorites/',
                templateUrl: 'views/favorites.html',
                data: {
                    title: 'Favorites'
                }
            })
            .state('people', {
                url:'/people/',
                templateUrl: 'views/people.html',
                data: {
                    title: 'People'
                }
            })
            .state('people.jake', {
                url:'jake/',
                parent:'people',
                templateUrl: 'views/peopleJake.html',
                data: {
                    title: 'Jake Made This',
                    backStateName: 'people'
                }
            })
            .state('applications', {
                url:'/applications/',
                templateUrl: 'views/applications.html',
                data: {
                    title: 'Applications'
                }
            })
            .state('applications.preferences', {
                url:'/preferences/',
                parent: 'applications',
                templateUrl: '/views/appPrefs.html',
                controller: 'SidebarAppPrefsCtrl',
                controllerAs: 'ctrl',
                data: {
                    title: 'Application Preferences'
                }
            })
            .state('preferences', {
                url:'/preferences/',
                templateUrl: 'views/preferences.html',
                data: {
                    title: 'Preferences'
                }
            });

    })
    .run(['$state', function($state){
        $state.transitionTo('dashboard');
    }])
    .controller('SidebarExampleCtrl', DemoController)
    .controller('SidebarAppPrefsCtrl', SidebarAppPrefsCtrl)
    .factory('pageTitleService', pageTitleService)
    .run(run);

run.$inject = ['$rootScope','$state','pageTitleService'];
function run($rootScope, $state, pageTitleService) {

    $rootScope.$on('$stateChangeStart', function () {
        pageTitleService.pageTitle = '';

        // this is optional, but seems like a good idea
        pageTitleService.showBack = false;
        pageTitleService.backFunction = function () {};
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.hasOwnProperty('data')){
            if(toState.data.hasOwnProperty('title')) {
                pageTitleService.pageTitle = toState.data.title;
            }
            if(toState.data.hasOwnProperty('backStateName')) {
                pageTitleService.showBack = true;
                pageTitleService.backFunction = function(){
                    $state.go(toState.data.backStateName);
                };
            }
        }
    });
}
