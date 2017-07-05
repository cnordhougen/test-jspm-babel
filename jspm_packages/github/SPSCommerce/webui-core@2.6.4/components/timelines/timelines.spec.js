
require('test/harness');

require('./timelines');

// This test spec is the only one using these "constants", so I'm
// just putting them in here for now, to reduce clutter.  If ever
// these constants are needed for any other tests, then we should
// just make this it's own file to be required into the harness.

angular.module('sps.test.constants', []).constant('Constants', {
    SELF_URI: '',
    BACKEND_URI: '',
    STATIC_ASSETS_URI: ''
}).run(['$rootScope', 'Constants', function($rootScope, Constants) {
    $rootScope.Constants = Constants;
}]);

describe('components/timelines/timelines.js', function() {
    var element, scope, $compile;

    beforeEach(angular.mock.module('sps.test.constants'));
    beforeEach(angular.mock.module('sps.components.timelines'));

    beforeEach(inject(function(_$compile_, $rootScope) {
        scope = $rootScope;
        $compile = _$compile_;
    }));

    var test_data = [
        {
            'retailer': {
                'id': '5453c42e8250294d21683ab9',
                'name': 'Remold'
            },
            'kick_off_date': {
                'description': 'Occaecat ipsum elit proident mollit incididunt aute.',
                'display_date': 'October 21st',
                'rfc_2822': 'Fri, 24 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Sunt duis occaecat Lorem eu dolor id ea quis occaecat ad consectetur nisi nostrud.',
                'display_date': 'November 8th',
                'rfc_2822': 'Tue, 04 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Et consectetur fugiat excepteur consectetur magna.',
                'display_date': 'November 10th',
                'rfc_2822': 'Sun, 16 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Adipisicing aliquip non anim quis eiusmod ut sunt sunt veniam adipisicing.',
                'display_date': 'November 21st',
                'rfc_2822': 'Tue, 25 Nov 2014 17:17:34 +0000'
            }
        },
        {
            'retailer': {
                'id': '5453c42e2df32388a100cf19',
                'name': 'Rodeocean'
            },
            'kick_off_date': {
                'description': 'Proident consectetur tempor laborum labore.',
                'display_date': 'October 21st',
                'rfc_2822': 'Tue, 21 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Culpa exercitation ut eu occaecat excepteur est tempor commodo.',
                'display_date': 'November 6th',
                'rfc_2822': 'Mon, 03 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Id occaecat elit aliqua velit excepteur sint veniam sint.',
                'display_date': 'November 12th',
                'rfc_2822': 'Fri, 14 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Aliquip ut officia id ipsum officia elit amet eu.',
                'display_date': 'November 28th',
                'rfc_2822': 'Fri, 21 Nov 2014 17:17:34 +0000'
            }
        },
        {
            'retailer': {
                'id': '5453c42ec0317153a72873f3',
                'name': 'Telpod'
            },
            'kick_off_date': {
                'description': 'Esse eiusmod excepteur ullamco tempor.',
                'display_date': 'October 21st',
                'rfc_2822': 'Mon, 27 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Veniam est laboris in dolor in irure.',
                'display_date': 'November 5th',
                'rfc_2822': 'Sat, 08 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Proident occaecat ex est aute nisi sunt pariatur pariatur fugiat.',
                'display_date': 'November 10th',
                'rfc_2822': 'Tue, 11 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Enim laboris tempor veniam officia sit officia exercitation excepteur amet mollit reprehenderit.',
                'display_date': 'November 27th',
                'rfc_2822': 'Sat, 22 Nov 2014 17:17:34 +0000'
            }
        },
        {
            'retailer': {
                'id': '5453c42ea397c1853f4a91cb',
                'name': 'Cubix'
            },
            'kick_off_date': {
                'description': 'Anim aliqua ea duis occaecat consectetur tempor dolor cupidatat anim velit ad do non.',
                'display_date': 'October 21st',
                'rfc_2822': 'Wed, 29 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Dolor consectetur ipsum veniam laboris ad enim.',
                'display_date': 'October 31st',
                'rfc_2822': 'Mon, 03 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Magna sint Lorem labore pariatur sint dolore et duis in cillum enim id ut excepteur.',
                'display_date': 'November 14th',
                'rfc_2822': 'Mon, 10 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Mollit ut nulla ea ad nulla.',
                'display_date': 'November 27th',
                'rfc_2822': 'Fri, 28 Nov 2014 17:17:34 +0000'
            }
        },
        {
            'retailer': {
                'id': '5453c42ed925b059a6a83231',
                'name': 'Ovation'
            },
            'kick_off_date': {
                'description': 'Excepteur do enim veniam esse officia sunt eiusmod sint labore ex in nostrud anim.',
                'display_date': 'October 21st',
                'rfc_2822': 'Sat, 25 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Esse occaecat id eiusmod tempor pariatur laborum Lorem adipisicing sunt est.',
                'display_date': 'November 7th',
                'rfc_2822': 'Mon, 03 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Culpa excepteur enim labore sit voluptate aliquip.',
                'display_date': 'November 20th',
                'rfc_2822': 'Tue, 18 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Aliquip cillum et ut ipsum et cillum ipsum sunt anim mollit nulla proident ipsum.',
                'display_date': 'November 20th',
                'rfc_2822': 'Wed, 26 Nov 2014 17:17:34 +0000'
            }
        },
        {
            'retailer': {
                'id': '5453c42eababd7778dc280be',
                'name': 'Quotezart'
            },
            'kick_off_date': {
                'description': 'Non consequat excepteur laborum qui magna nulla consectetur elit mollit ea.',
                'display_date': 'October 21st',
                'rfc_2822': 'Sun, 26 Oct 2014 17:17:34 +0000'
            },
            'commit_date': {
                'description': 'Officia minim et ad dolore et mollit irure aliqua mollit aliqua proident dolore occaecat sint.',
                'display_date': 'November 6th',
                'rfc_2822': 'Sat, 08 Nov 2014 17:17:34 +0000'
            },
            'cert_date': {
                'description': 'Ex do aute Lorem aute officia.',
                'display_date': 'November 11th',
                'rfc_2822': 'Thu, 20 Nov 2014 17:17:34 +0000'
            },
            'live_date': {
                'description': 'Exercitation magna cillum nulla officia esse duis laborum non cupidatat incididunt.',
                'display_date': 'November 22nd',
                'rfc_2822': 'Sun, 30 Nov 2014 17:17:34 +0000'
            }
        }
    ];

    it('should have headings', function () {
        scope.selected_obj = {timeline: test_data[0]};

        // Create an instance of the directive
        element = angular.element('<div sps-timelines="" selected-timeline="selected_obj" side-bar="false"></div>');
        $compile(element)(scope); // Compile the directive
        scope.$digest(); // Update the HTML

        var headings = element.find('h3');
        expect(headings[3]).toBeDefined();
        expect($(headings[3]).text()).toEqual(scope.selected_obj.timeline.live_date.display_date);
    });

    it('should create a menu of timelines', function() {
        scope.selected_obj = {timeline: test_data[1]};
        scope.timelines = test_data;

        // Create an instance of the directive
        element = angular.element('<div sps-timelines="timelines" selected-timeline="selected_obj"></div>');
        $compile(element)(scope); // Compile the directive
        scope.$digest(); // Update the HTML

        var options = element.find('option');
        expect(options.length).toEqual(test_data.length);
    });
    /*
    xit('should calculate the today location in the wider version', function() {
        // @TODO: Write this test
    });

    xit('should space the date evenly in the wide version', function() {
        // @TODO: Write this test
    });
    */

    it('should create a narrow version', function() {
        scope.selected_obj = {timeline: test_data[1]};

        // Create an instance of the directive
        element = angular.element('<div sps-timelines="" selected-timeline="selected_obj" side-bar="true"></div>');
        $compile(element)(scope); // Compile the directive
        scope.$digest(); // Update the HTML

        expect(element.children().hasClass('min-timeline')).toBeTruthy();
    });



});
