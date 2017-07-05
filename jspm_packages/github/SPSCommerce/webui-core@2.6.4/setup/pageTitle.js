
var _get = require('lodash/object/get');

module.exports = PageTitleSetup;

PageTitleSetup.$inject = [
    '$rootScope',
    'commercePlatform'
];

/**
 * Globally set the Commerce Platform page title to match the state
 * title - if one is specified. This will benefit any application
 * that is using the <spsui-page-nav> component to render their
 * top-level navigation.
 *
 * @param $rootScope
 * @param commercePlatform
 * @constructor
 */
function PageTitleSetup($rootScope, commercePlatform) {

    $rootScope.$on('$stateChangeSuccess', function(e, state) {
        var title = _get(state, 'data.title', '');
        commercePlatform.setPageTitle(title);
    });

}
