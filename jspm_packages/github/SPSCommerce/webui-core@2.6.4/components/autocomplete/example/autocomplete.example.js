var angular = require('angular');
var webuiCore = require('webui-core');

var autocomplete = require('../autocomplete.module');

var deps = [
    webuiCore.name,
    autocomplete.name
];

var Controller = require('./autocomplete.example.ctrl');

module.exports = angular
    .module('Example', deps)
    .controller('ExampleCtrl', Controller);
