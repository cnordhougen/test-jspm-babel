var angular = require('angular');
var moment = require('moment');
require('moment-timezone');

module.exports = angular
    .module('dateTimeExample', [
        require('webui-core').name,
        require('webui-core/modules/datetime').name
    ])
    .controller('AppController', AppController);

AppController.$inject = [
    '$interval',
    '$scope',
    '$timeout',
    'localizationService'
];

function AppController($interval, $scope, $timeout, localizationService) {

    var _formats = require('../datetime.formats');
    var _locales = localizationService.options.locales;

    this.date = new Date('02/29/2016 3:03:50 PM CST');
    this.formats = _formats;
    this.locales = _locales;
    this.settings = localizationService.settings;
    this.timezones = moment.tz.names();
    this.relative = _relativeDates();

    function _relativeDates() {
        return [
            moment().add(3, 'm'),
            moment().add(3, 'h'),
            moment().add(3, 'd'),
            moment().add(1, 'M'),
            moment().subtract(10, 'm'),
            moment().subtract(12, 'h'),
            moment().subtract(6, 'd'),
            moment().subtract(2, 'M')
        ];
    }

}
