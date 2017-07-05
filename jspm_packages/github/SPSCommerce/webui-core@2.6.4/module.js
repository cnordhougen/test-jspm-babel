
var angular = require('angular');

require('angular-ui-router');
require('./decorators/ui-sref/ui-sref');

var compApplication = require('./components/application/application');
var compPageTitle = require('./components/pagetitle/pagetitle');
var compPageNav = require('./components/page-nav/page-nav');
var compPagination = require('./components/pagination-footer/pagination-footer');
var compViewPort = require('./components/viewport/viewport');
var compSidebar = require('./components/sidebar/sidebar');
var compFooter = require('./components/footer/footer');

var setupAppInit = require('./setup/appInit');
var setupPageTitle = require('./setup/pageTitle');
var setupFoundation = require('./setup/foundation');
var setupRedirectTo = require('./setup/redirectTo');
var setupDeepLinking = require('./setup/deepLinking');
var setupOptionalSlash = require('./setup/optionalSlash');

var utilsForm = require('./utils/form');
var postMessage = require('./services/postMessage/postMessage');

var MessageBus = require('./messaging/messageBus/messageBus');
var messageBus = window.sps.messageBus = new MessageBus(window.parent);

module.exports = angular.module('webui-core', [
    require('./modules/token'),
    require('./modules/identity'),
    require('./modules/currentUser'),
    require('./modules/localization'),
    require('./modules/commercePlatform'),
    compApplication.name,
    compPageTitle.name,
    compPageNav.name,
    compPagination.name,
    compViewPort.name,
    compSidebar.name,
    compFooter.name,
    utilsForm.name,
    'ui.router'
]).value('messageBus', messageBus)
  .service('postMessage', postMessage)
  .config(setupOptionalSlash)
  .run(setupDeepLinking)
  .run(setupFoundation)
  .run(setupRedirectTo)
  .run(setupPageTitle)
  .run(setupAppInit);


