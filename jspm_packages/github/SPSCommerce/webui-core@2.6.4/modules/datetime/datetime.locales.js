var moment = require('moment');

require('moment/locale/zh-cn');
require('moment/locale/zh-tw');
require('moment/locale/en-au');
require('moment/locale/en-ca');
require('moment/locale/en-ie');
require('moment/locale/en-gb');
require('moment/locale/fr-ca');
require('moment/locale/fr');
require('moment/locale/es');

moment.defineLocale('en-US', {
    parentLocale: 'en',
    longDateFormat : {
        LT: 'h:mm A',
        LTS: 'h:mm:ss A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY @ LT',
        LLLL: 'dddd MMMM D, YYYY @ LT'
    }
});

moment.defineLocale('en-US24', {
    parentLocale: 'en-US',
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss'
    }
});

/* Full List of Moment Locales
{
    'ar-tn': 'Arabic (Tunisia)',
    'hy-am': 'Armenian',
    'az': 'Azerbaijani',
    'id': 'Bahasa Indonesia',
    'ms-my': 'Bahasa Melayu (Malaysia)',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'br': 'Breton',
    'bg': 'Bulgarian',
    'my': 'Burmese',
    'ca': 'Catalan',
    'zh-cn': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'cv': 'Chuvash',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en-au': 'English (Australia)',
    'en-ca': 'English (Canada)',
    'en-ie': 'English (Ireland)',
    'en-nz': 'English (New Zealand)',
    'en-gb': 'English (United Kingdom)',
    'en': 'English (United States)',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'fo': 'Farose',
    'fi': 'Finnish',
    'fr': 'French',
    'fr-ca': 'French (Canada)',
    'fr-ch': 'French (Switzerland)',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'de-at': 'German (Austria)',
    'el': 'Greek',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'it': 'Italian',
    'ja': 'Japanese',
    'jv': 'Javanese',
    'kk': 'Kazakh',
    'km': 'Khmer (Cambodia)',
    'tlh': 'Klingon',
    'ko': 'Korean',
    'lo': 'Lao',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'ml': 'Malayalam',
    'dv': 'Maldivian',
    'mr': 'Marathi',
    'me': 'Montenegrin',
    'ne': 'Nepalese',
    'se': 'Northern Sami',
    'nb': 'Norwegian',
    'nn': 'Norwegian Nynorsk',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pt-br': 'Portuguese (Brazil)',
    'ro': 'Romanian',
    'ru': 'Russian',
    'gd': 'Scottish Gaelic',
    'sr': 'Serbian',
    'sr-cyrl': 'Serbian Cyrillic',
    'si': 'Sinhalese',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'es': 'Spanish',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tl-ph': 'Tagalog (Filipino)',
    'tzl': 'Talossan',
    'tzm': 'Tamaziɣt',
    'tzm-latn': 'Tamaziɣt Latin',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'bo': 'Tibetan',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh'
};
*/
