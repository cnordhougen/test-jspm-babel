
module.exports = require('angular')
    .module('spsui.currentUser', [])
    .service('currentUser', require('./currentUser.service'))
    .run(require('./currentUser.init'))
    .name;
