require('./document-payload.min.css!');
var angular   = require('angular'),
    directive = require('./document-payload.directive');

module.exports = angular.module('webui-document-payload', [])
                        .directive('spsuiDocumentPayload', directive);
