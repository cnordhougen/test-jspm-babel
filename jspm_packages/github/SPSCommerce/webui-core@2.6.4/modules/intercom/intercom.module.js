
require('./intercom.style.min.css!');

window.sps = window.sps || {};

/**
 * Intercom Module configures and installs the Intercom Messenger
 * into your application. In order to run properly, your application
 * will need to be passed a valid user access token. This is easily
 * achieved by launching your app from Commerce Platform.
 *
 * Before the Intercom Messenger can be launched, it needs information
 * about your current user. This information is indirectly gleaned from
 * the user access token passed to your app.
 *
 * If you do not have a valid token passed into your app, such as when
 * developing locally, the Intercom Messenger will not launch.
 *
 * Configuration is available via the intercomServiceProvider.
 *
 * Also see: https://developers.intercom.io/reference for a complete
 * list of the available Intercom API methods.
 */
window.sps.intercomModule = require('angular')
    .module('webui-intercom', [])
    .provider('intercomService', require('./intercom.service.provider'))
    .run(require('./intercom.init'));

module.exports = window.sps.intercomModule;
