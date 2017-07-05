var _ = require('lodash');

module.exports = OptionalSlash;

OptionalSlash.$inject = [
    '$urlRouterProvider'
];

function OptionalSlash($urlRouterProvider) {

    $urlRouterProvider.rule(function ($injector, $location) {

        var params = [];
        var path = $location.path();
        var search = $location.search();

        if (path[path.length - 1] === '/') { return; }
        if (Object.keys(search).length === 0) { return path + '/'; }

        _.forEach(search, function (v, k) {
            params.push(k + '=' + v);
        });

        return path + '/?' + params.join('&');
    });

}
