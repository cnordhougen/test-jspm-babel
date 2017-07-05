
var Template = require('./pagination-footer.html!text');
var Controller = require('./pagination-footer.ctrl');

module.exports = PaginationDirective;

function PaginationDirective () {

    return {
        restrict: 'E',
        scope: {},
        bindToController: {
            api: '=',
            onReady: '=',
            onChange: '=',
            sizeOptions: '=',
            searchParams: '='
        },
        template: Template,
        controller: Controller,
        controllerAs: 'ctrl'
    };

}
