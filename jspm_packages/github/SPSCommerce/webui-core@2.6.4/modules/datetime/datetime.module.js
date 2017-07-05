require('moment');
require('moment-timezone');
require('./datetime.locales');

window.sps = window.sps || {};

/**
 * DateTime Module provides a date formatting filter that enables
 * consistent, localized date strings based upon user's preferences.
 * This module uses MomentJS and MomentTimezone for date formatting.
 */
window.sps.datetimeModule = require('angular')
    .module('webui-datetime', [])
    .filter('spsuiDate', require('./datetime.filter'))
    .directive('spsuiDate', require('./datetime.directive'));

module.exports = window.sps.datetimeModule;


