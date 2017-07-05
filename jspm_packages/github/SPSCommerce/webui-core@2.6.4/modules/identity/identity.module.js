
module.exports = require('angular')
    .module('spsui.identity', [])
    .provider('identityService', require('./identity.service.provider'))
    .run(require('./identity.init'))
    .name;
