var items = [
    {
        'id': 'dashboard',
        'displayName': 'Dashboard',
        'iconClass': 'fa fa-tachometer fa-lg',
        'routingState': 'dashboard'
    }, {
        'id': 'favorites',
        'displayName': 'Favorites',
        'iconClass': 'fa fa-star-o fa-2x',
        'routingState': 'favorites'
    }, {
        'id': 'preferences ',
        'displayName': 'Preferences',
        'iconClass': 'fa fa-sliders fa-2x',
        'routingState': 'preferences'
    }, {
        'id': 'people',
        'displayName': 'People',
        'iconClass': 'fa fa-users fa-lg',
        'routingState': 'people'
    }, {
        'id': 'applications',
        'displayName': 'Applications',
        'iconClass': 'fa fa-th fa-lg',
        'routingState': 'applications'
    }

];

module.exports = function SidebarExample($scope, sidebarService, pageTitleService) {

    this.toggleNav = function () {
        sidebarService.toggleNav();
    };

    this.titleService = pageTitleService;

    this.configObj ={
        title:{displayName:'Sidebar Example', iconClass:'fa fa-globe fa-lg'},
        items:items
    };

};
