module.exports = DeepLinking;

DeepLinking.$inject = [
    '$rootScope',
    'commercePlatform'
];

function DeepLinking($rootScope, commercePlatform) {

    // This sends every application state change to the Commerce Platform
    // via PostMessage.  Platform then appends this location to it's own
    // URL to form a nice human readable deeplink.

    $rootScope.$watch(function() {

        return window.location.hash;

    }, function() {

        commercePlatform.updateState();

    });

}
