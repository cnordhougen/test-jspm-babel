var $ = require('jquery');

module.exports = PageNavDirective;

PageNavDirective.$inject = ['pageNavService'];

function PageNavDirective(pageNavService) {

    return {
        scope: {},
        restrict: 'E',
        transclude: true,
        bindToController: {
            items: '=',
            title: '@',
            titleState: '@',
            logoImageUrl: '@',
        },

        link: link,
        controller: controller,
        controllerAs: 'pageNavCtrl',
        template: require('./page-nav.tpl.html!text')
    };

    function link (scope, el, attr) {
        if (attr.logoImageUrl) {
            $(el).find('h1 > *')
                 .addClass('application-logo')
                 .css('background-image', 'url(' + attr.logoImageUrl + ')');
        }
    }

    function controller () {

        if (!this.titleState && this.items && this.items.length > 0) {
            this.titleState = this.items[0].state;
        }

        pageNavService.setItems(this.items);
    }

}

