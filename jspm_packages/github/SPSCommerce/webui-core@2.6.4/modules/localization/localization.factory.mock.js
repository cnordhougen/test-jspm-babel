module.exports = Localization;

function Localization() {

    var _this = this;

    this.id = 'mocked-id';
    this.env = '';
    this.part = '';
    this.path = '';
    this.type = '';
    this.name = '';
    this.version = '';

    this.init = function() {
        return window.$q.resolve();
    };

    this.whenReady = function() {
        return window.$q.resolve();
    };

    this.setEnvironment = function(env) {
        _this.env = env;
    };

    this.getTranslationPath = function() {
        return window.$q.resolve();
    };

}

Localization.getId = function() {
    return 'mocked-id';
};
