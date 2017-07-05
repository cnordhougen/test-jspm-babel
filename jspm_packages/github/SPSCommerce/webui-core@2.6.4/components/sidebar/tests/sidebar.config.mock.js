module.exports = {
    title: {
        'displayName': 'My Product',
        'iconClass': 'icon-fulfillment'
    },
    items: [{
        'id': 'dashboard',
        'displayName': 'Dashboard',
        'iconClass': 'icon-dashboard',
        'routingState': 'universal-network.dashboard'
    }, {
        'id': 'companies',
        'displayName': 'Companies',
        'iconClass': 'icon-companies',
        'routingState': 'universal-network.companies'
    }, {
        'id': 'people',
        'displayName': 'People',
        'iconClass': 'icon-people',
        'routingState': 'universal-network.people'
    }, {
        'id': 'applications',
        'displayName': 'Applications',
        'iconClass': 'icon-apps',
        'routingState': 'universal-network.applications',
        'authRequiresOrg': true
    }]
};
