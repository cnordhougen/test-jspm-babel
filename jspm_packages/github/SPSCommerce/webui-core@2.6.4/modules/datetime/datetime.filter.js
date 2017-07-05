var moment = require('moment');
var formats = require('./datetime.formats');

require('moment-timezone');
require('./datetime.locales');

module.exports = DateTimeFilter;

DateTimeFilter.$inject = ['$log', 'localizationService'];

function DateTimeFilter($log, localizationService) {

    return function(input, format, relative) {

        format = formats[format];

        var mmnt;
        var locale = localizationService.settings.locale;
        var locales = localizationService.options.locales;
        var timezone = localizationService.settings.timezone;

        if (!locale || !timezone) {
            return input;
        }

        if (!format) {
            $log.warn('Unknown spsuiDate filter format:', format);
            return input;
        }

        if (!locales[locale]) {
            $log.warn('Unknown spsuiDate filter locale:', locale);
            return input;
        }

        if (input instanceof moment) {
            mmnt = input.tz(timezone);
        } else if (input instanceof Date) {
            mmnt = moment.tz(input, timezone);
        } else if (typeof input === 'string') {
            mmnt = moment.tz(new Date(input), timezone);
        }

        if (!mmnt || !mmnt.isValid()) {
            $log.warn('Date passed to spsuiDate filter is invalid:', input);
            return input;
        } else {
            mmnt.locale(locale);
            moment.locale(locale);
        }

        // According to the rules outlined by the design team,
        // relative dates should only be displayed if the date
        // is within ±7 days.  Otherwise render the fallback
        // date format.

        if (relative) {
            var diff = Math.abs(moment().diff(mmnt, 'd', true));
            if (diff <= 7) {
                return moment().to(mmnt);
            }
        }

        return mmnt.format(format);

    };
}
