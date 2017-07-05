var LocalizationMock = require('./localization.factory.mock');
var LocalizationOptions = require('./localization.options');

module.exports = {

    options: LocalizationOptions,

    settings: {
        locale: 'en-US',
        timezone: 'UTC',
        language: 'en-US'
    },

    setCloaking: function(){},
    onLocaleChange: function(){},
    onTimezoneChange: function(){},
    onLanguageChange: function(){},

    localize: function(){
        return new LocalizationMock();
    },

    getLocalization: function() {
        return new LocalizationMock();
    },

    registerTranslationPath: function() {},

    cloakElement: function(){},

    uncloakElement: function(){},

    uncloakElementsByKey: function(){},

};
