var $ = require('jquery');

module.exports = ApplicationController;

ApplicationController.$inject = ['$element'];

function ApplicationController(element) {

    var $wrapper = $(element).find('.content-wrapper');

    var classes = {
        withSidebar: 'with-sidebar',
        withPageTitle: 'with-page-title',
        withPageNav: 'with-page-nav',
        centered: 'centered'
    };

    this.hasSidebar = function() {
        $wrapper.addClass(classes.withSidebar);
    };

    this.noSidebar = function() {
        $wrapper.removeClass(classes.withSidebar);
    };

    this.hasPageTitle = function() {
        $wrapper.addClass(classes.withPageTitle);
    };

    this.hasPageNav = function() {
        $wrapper.addClass(classes.withPageNav);
    };

    this.noPageTitle = function() {
        $wrapper.removeClass(classes.withPageTitle);
    };

    this.centered = function() {
        $wrapper.addClass(classes.centered);
    };

}
