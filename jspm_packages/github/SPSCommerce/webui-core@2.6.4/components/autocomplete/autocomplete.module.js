var angular = require('angular');
var directive = require('./autocomplete.directive');

require('typeahead.js/dist/typeahead.jquery');
require('./autocomplete.min.css!');

module.exports = angular
    .module('webui-autocomplete', [])
    .directive('spsuiAutocomplete', directive)
    .run(['localizationService', function (localizationService) {

        localizationService.localize({
            component: 'webui-autocomplete'
        });

    }]);
