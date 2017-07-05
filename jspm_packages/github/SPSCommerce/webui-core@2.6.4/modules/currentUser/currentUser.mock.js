module.exports = {

    token: '',

    details: {
        'externally_managed': false,
        'first_name': 'Foo',
        'last_name': 'Bar',
        'roles': [
            'app:read',
            'app:write'
        ],
        'id': '1234',
        'organization': {
            'organization_name': 'FooBarBaz',
            'organization_site': 'www.foo.com',
            'namespace': 'foo',
            'id': '9876'
        },
        'meta': {
            'created': ''
        },
        'job_title': 'foo',
        'user_type': 'bar',
        'email': 'user@foo.com',
        'preferences': {
            'locale': '',
            'timezone': '',
            'language': []
        }
    },

    whoami: function(){},

    whenReady: function() {
        return new window.$q(function(){});
    }

};
