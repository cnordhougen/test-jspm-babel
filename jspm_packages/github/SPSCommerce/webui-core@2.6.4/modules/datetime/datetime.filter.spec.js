require('test/harness');

var _ = require('lodash');
var moment = require('moment');
var Filter = require('./datetime.filter');

describe('modules/datetime/datetime.filter', function () {

    var spy;
    var $log;
    var filter;
    var result;
    var localizationService;

    var inputTextStr = '02/29/2016 3:03:50 PM CST';
    var inputDateObj = new Date(inputTextStr);
    var inputMmntObj = moment(inputDateObj);

    var CST = 'America/Chicago';
    var PST = 'America/Los_Angeles';

    var answers = {
        en: {
            CST: {
                'SHORT_TIME': '3:03 PM',
                'SHORT_TIME_ZONE': '3:03 PM CST',
                'LONG_TIME': '3:03:50 PM',
                'LONG_TIME_ZONE': '3:03:50 PM CST',
                'NUM_DATE': '02/29/2016',
                'SHORT_DATE': 'Feb 29, 2016',
                'LONG_DATE': 'February 29, 2016',
                'SHORT_DATETIME': 'Feb 29, 2016 @ 3:03 PM',
                'SHORT_DATETIME_ZONE': 'Feb 29, 2016 @ 3:03 PM CST',
                'LONG_DATETIME': 'February 29, 2016 @ 3:03 PM',
                'LONG_DATETIME_ZONE': 'February 29, 2016 @ 3:03 PM CST',
                'SHORT_FULLDATETIME': 'Mon Feb 29, 2016 @ 3:03 PM',
                'SHORT_FULLDATETIME_ZONE': 'Mon Feb 29, 2016 @ 3:03 PM CST',
                'LONG_FULLDATETIME': 'Monday February 29, 2016 @ 3:03 PM',
                'LONG_FULLDATETIME_ZONE': 'Monday February 29, 2016 @ 3:03 PM CST'
            },
            PST: {
                'SHORT_TIME_ZONE': '1:03 PM PST'
            }
        },
        uk: {
            CST: {
                'NUM_DATE': '29/02/2016'
            }
        }
    };

    beforeEach(function(){

        angular.mock.module(function ($provide) {
            $provide.value('localizationService', require('webui-core/modules/localization/localization.service.mock'));
        });

        inject(function(_localizationService_) {
            result = null;
            $log = {warn: function(){}};
            spy = spyOn($log, 'warn');
            localizationService = _localizationService_;
        });
    });

    function _newFilter(locale, timezone) {
        if (locale) { localizationService.settings.locale = locale; }
        if (timezone) { localizationService.settings.timezone = timezone; }
        filter = new Filter($log, localizationService);
        return filter;
    }

    it('should use localizationService locale setting', function(){
        _newFilter('en-GB', CST);
        result = filter(inputDateObj, 'NUM_DATE');
        expect(result).toBe(answers.uk.CST.NUM_DATE);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should use localizationService timezone setting', function(){
        _newFilter('en-US', PST);
        result = filter(inputDateObj, 'SHORT_TIME_ZONE');
        expect(result).toBe(answers.en.PST.SHORT_TIME_ZONE);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should warn if format is not valid', function(){
        _newFilter('en-US', CST);
        result = filter(inputDateObj, 'INVALID_FORMAT');
        expect(spy).toHaveBeenCalled();
    });

    it('should warn if locale is not valid', function(){
        _newFilter('invalid', CST);
        result = filter(inputDateObj, 'NUM_DATE');
        expect(spy).toHaveBeenCalled();
    });

    it('should support JS date objects', function(){
        _newFilter('en-US', CST);
        result = filter(inputDateObj, 'LONG_DATE');
        expect(result).toBe(answers.en.CST.LONG_DATE);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should support Moment objects', function(){
        _newFilter('en-US', CST);
        result = filter(inputMmntObj, 'LONG_DATE');
        expect(result).toBe(answers.en.CST.LONG_DATE);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should support string dates', function(){
        _newFilter('en-US', CST);
        result = filter(inputTextStr, 'LONG_DATE');
        expect(result).toBe(answers.en.CST.LONG_DATE);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should warn if date is invalid (1)', function(){
        _newFilter('en-US', CST);
        result = filter({}, 'LONG_DATE');
        expect(spy).toHaveBeenCalled();
    });

    it('should warn if date is invalid (2)', function(){
        _newFilter('en-US', CST);
        result = filter('', 'LONG_DATE');
        expect(spy).toHaveBeenCalled();
    });

    it('should return relative date if within 7 days', function(){
        _newFilter('en-US', CST);
        var date = moment().subtract(6, 'd');
        result = filter(date, 'LONG_DATE', 'RELATIVE');
        expect(result).toBe('6 days ago');
        expect(spy).not.toHaveBeenCalled();
    });

    it('should return formatted date if more than 7 days', function(){
        _newFilter('en-US', CST);
        var date = moment().add(8, 'd');
        var result1 = filter(date, 'LONG_DATE', 'RELATIVE');
        var result2 = filter(date, 'LONG_DATE');
        expect(result1).toBe(result2);
        expect(spy).not.toHaveBeenCalled();
    });

    _.forEach(answers.en.CST, function(answer, format){
        it('should correctly format ' + format, function() {
            _newFilter('en-US', CST);
            result = filter(inputDateObj, format);
            expect(result).toBe(answer);
            expect(spy).not.toHaveBeenCalled();
        });
    });

});
