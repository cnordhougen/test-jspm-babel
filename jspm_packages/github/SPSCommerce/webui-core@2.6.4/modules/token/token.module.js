/**
 * Token Module captures the user access token from the URL and
 * makes it available via a tokenService. If desired, the token
 * can be injected into the Authorization header of HTTP requests.
 *
 * Configuration is available via the tokenServiceProvider.
 */
module.exports = require('angular')
    .module('spsui.token', [require('webui-core/modules/currentUser')])
    .provider('tokenService', require('./token.service.provider'))
    .name;
