/**
 * The pagination footer component is placed below a table/list of data and offers controls
 * that manipulate the current page and size of pages displayed in that table.
 *
 * @owner Commerce Platform
 */

var angular = require('angular');

require('./pagination-footer.min.css!');

var Directive = require('./pagination-footer.directive');

module.exports = angular
    .module('spsui.paginationfooter', [])
    .directive('spsuiPaginationFooter', Directive);
