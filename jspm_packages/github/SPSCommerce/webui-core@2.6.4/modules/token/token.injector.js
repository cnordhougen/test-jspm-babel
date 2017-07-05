var _ = require('lodash');

module.exports = TokenInjector;

TokenInjector.$inject = ['tokenService'];

/**
 * TokenInjector is what is pushed into the $httpProvider.interceptors.
 *
 * To configure it so the header is injected into every $http request
 * automatically, you can use the tokenServiceProvider.injectAuthHeader()
 * configuration method.
 *
 * To enable or disable this behavior temporarily at a per-request level,
 * you can pass an option to the request config.
 *
 * Example:
 *
 * $http.get('/api', {useToken: true});  // will inject header regardless of global setting
 * $http.get('/api', {useToken: false}); // will not inject header regardless of global setting
 *
 */
function TokenInjector(tokenService) {
    return {
        request: function (config) {

            var token = tokenService.token;
            var userSetting = _.get(config, 'useToken');
            var globalSetting = tokenService.injectAuthHeader;
            var inject = userSetting === true || (globalSetting === true && userSetting !== false);

            if (token && inject) {
                _.set(config, 'headers.AUTHORIZATION', 'Bearer ' + token);
            }

            return config;
        }
    };
}
