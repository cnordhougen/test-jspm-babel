require('./prepare');
require('./style/style');

window._ = require('lodash');
window.Modernizr = require('modernizr');
window.jQuery = window.$ = require('jquery');
window.angular = require('angular');

require('angular-cookie');
require('angular-sanitize');
require('angular-ui-router');
require('angular-foundation');

require('foundation');
require('foundation/js/foundation/foundation.tab');
require('foundation/js/foundation/foundation.topbar');
require('foundation/js/foundation/foundation.dropdown');
require('foundation/js/foundation/foundation.reveal');
require('foundation/js/foundation/foundation.tooltip');
require('foundation/js/foundation/foundation.joyride');

require('./components/chosen/chosen');
require('./components/datepicker/datepicker');

require('./utils/url');
require('./utils/form');

window.sps = window.sps || {};
window.sps.webuiCore = require('./module');
window.sps.messageApi = require('./services/messageApi/messageApi');

// Legacy support for window.Rubicon
window.Rubicon = window.sps.messageApi;

window.jQuery(document).foundation();

module.exports = window.sps.webuiCore;
