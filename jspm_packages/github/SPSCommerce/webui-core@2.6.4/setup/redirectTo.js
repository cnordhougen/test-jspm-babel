module.exports = RedirectTo;

RedirectTo.$inject = [
    '$rootScope',
    '$state'
];

/**
 * This configuration allows users to add a redirectTo property
 * to any state config object. Typically, redirecting to a child
 * state can be a headache. This event listener simply listens
 * for state changes, prevents default behavior and redirects
 * to the provided state.
 *
 * Example:
 *
 * $stateProvider.state({
 *      name: 'users',
 *      url: '/users/',
 *      template: '<ui-view/>',
 *      redirectTo: 'users.list'
 * });
 *
 */
function RedirectTo($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
        }
    });
}
