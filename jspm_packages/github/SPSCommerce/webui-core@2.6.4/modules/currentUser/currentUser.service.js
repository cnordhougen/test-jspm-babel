
module.exports = CurrentUser;

CurrentUser.$inject = [
    '$q',
    '$log',
    'tokenService',
    'identityService',
    'messageBus'
];

function CurrentUser($q, $log, tokenService, identityService, messageBus) {

    var _this = this;

    var _ready = $q.defer();

    messageBus.on('setUserPreferences', _this.setPreferences);

    /**
     * Returns promise that is resolved when the current user
     * details have been loaded and the object is ready for use.
     *
     * @returns Promise - resolved when env is set
     */
    this.whenReady = function() {
        return _ready.promise;
    };

    /**
     * Resolve the ready promise, used internally when whoami()
     * completes. Can also be resolved externally if needed.
     */
    this.ready = function () {
        _ready.resolve(_this.details);
    };

    /**
     * User details as retrieved from Identity. This is populated during
     * the currentUser.whoami() method call.
     *
     * @type {Object}
     */
    this.details = {
        preferences: {
            language: [],
            locale: '',
            timezone: ''
        }
    };

    /**
     * User access token, populated when WebUI-Core is bootstrapped
     * and an access token is provided from Commerce Platform.
     *
     * @type {String}
     */
    this.token = tokenService.token;

    /**
     * Set user preferences from an object. Only sets values that are passed in.
     *
     * @param prefs
     */
    this.setPreferences = function (prefs) {
        prefs = prefs || {};
        Object.keys(prefs).forEach(function(key) {
            _this.details.preferences[key] = prefs[key];
        });
    };

    /**
     * Convenience method for making an Identity call to check the current user's
     * token. The results of the whoami call are then used to populate the current
     * user's details.
     *
     * @returns {Promise}
     */
    this.whoami = function () {
        if (!_this.token) {
            _ready.reject();
            return $q.reject();
        }
        return identityService.whoami().then(function (details) {
            Object.keys(details).forEach(function(key) {
                if (key === 'preferences') {
                    _this.setPreferences(details[key]);
                } else {
                    _this.details[key] = details[key];
                }
            });
            _this.ready();
            return _this.details;
        });
    };

}
