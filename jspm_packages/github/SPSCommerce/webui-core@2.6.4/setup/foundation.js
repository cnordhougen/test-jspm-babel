
var $ = require('jquery');
require('foundation');

module.exports = SetupFoundation;

SetupFoundation.$inject = ['$rootScope'];

function SetupFoundation($rootScope) {

    // Everytime the ui-router state changes and a new view is rendered,
    // retrigger Foundation to check the DOM for any of it's own plugins.

    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });

}
