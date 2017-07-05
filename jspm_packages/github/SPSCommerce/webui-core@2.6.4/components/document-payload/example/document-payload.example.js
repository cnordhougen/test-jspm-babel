var angular    = require('angular'),
    webuiCore  = require('webui-core'),
    docPayload = require('../document-payload.module'),
    ctrl       = require('./document-payload.example.ctrl');

module.exports = angular.module('Example', [ webuiCore.name, docPayload.name ])
                        .controller('ExampleCtrl', ctrl);
