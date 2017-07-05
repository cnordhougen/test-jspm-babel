/**
 * CommercePlatform service for interacting with the parent platform window.
 *
 */
module.exports = require('angular')
    .module('spsui.commercePlatform', [])
    .provider('commercePlatform', require('./commercePlatform.service.provider'))
    .name;
