module.exports = CommercePlatformServiceProvider;

function CommercePlatformServiceProvider() {

    var _timeout = 5000;
    var _environment = '';

    this.setEnvironment = function (env) {
        _environment = String(env);
    };

    this.setDetectionTimeout = function (timeout) {
        _timeout = Number(timeout);
    };

    this.$get = [
        '$q',
        '$log',
        '$timeout',
        '$location',
        '$rootScope',
        'messageBus',
        function ($q, $log, $timeout, $location, $rootScope, messageBus) {

        function CommercePlatformService() {

            var _cache = {};

            /**
             * Send a message to Commerce Platform with a new page title.
             * This allows the application to update the page title so the
             * browser will reflect the correct title in tabs, bookmarks, or
             * history.
             *
             * From example app "FooBar":
             *
             *      commercePlatform.setPageTitle('View Users');
             *      // result => "SPS FooBar: View Users"
             *
             * To reset the page title:
             *
             *      commercePlatform.setPageTitle(null);
             *      // result => "SPS FooBar"
             *
             * @param {String} title
             */
            this.setPageTitle = function(title) {
                messageBus.send('setPageTitle', String(title || ''));
            };

            /**
             * Send a message to Commerce Platform with an updated state.
             * This is used when updating URL query params so that they
             * appear in the browser address bar.
             */
            this.updateState = function() {
                messageBus.send('appStateChange', {
                    path: $location.path(),
                    search: $location.search()
                });
            };

            /**
             * Show a spinner overlay.
             */
            this.showSpinner = function() {
                messageBus.send('spinnerShow');
            };

            /**
             * Hide the spinner overlay.
             */
            this.hideSpinner = function() {
                messageBus.send('spinnerHide');
            };

            /**
             * Show an error page. Available options are: 400, 403, 404, 500.
             *
             * @param {string|number} error
             */
            this.showErrorPage = function(error) {
                messageBus.send('showErrorPage', error);
            };

            /**
             * Get the current application URL from Commerce Platform.
             *
             * The first time this is called, the resulting Promise is
             * cached locally. All subsequent calls get the cached Promise
             * unless the refresh param is set to true.
             *
             * Used by ui-sref component and this.getEnvironment();
             *
             * Promise resolves with URL or rejected if no response.
             *
             * Example:
             *
             * commercePlatform.getAppURL().then(function (url) {
             *
             *      // result something like:
             *      // https://commerce.spscommerce.com/fulfillment
             *
             * }).catch(function(){
             *
             *      // No response from Commerce Platform, probably
              *     // running locally or not inside the platform.
              *
             * });
             *
             * @param {Boolean} [refresh]
             * @returns {Promise} resolved with URL, rejected if no response
             */
            this.getAppURL = function (refresh) {

                if (_cache.appUrl && !refresh) {
                    return _cache.appUrl;
                }

                var timer;

                _cache.appUrl = $q(function(resolve, reject) {

                    messageBus.send('getAppBaseUrl').onResponse(function(url) {
                        if (url) {
                            resolve(url);
                        } else {
                            reject('no-url');
                        }
                        $timeout.cancel(timer);
                    });

                    // If we don't hear from Commerce Platform within a short
                    // time, reject the promise with no value. This allows us
                    // to assume that we're not within Commerce Platform and
                    // carry on with our business.

                    timer = $timeout(function () {
                        delete _cache.appUrl;
                        reject('timeout');
                    }, _timeout);

                });

                return _cache.appUrl;
            };

            /**
             * Determine which Commerce Platform environment we're currently
             * running in. If the environment is set in the config phase, then
             * return that value.  Otherwise autodetect the env from the current
             * Commerce Platform app URL.
             *
             * Possible envs: dev | test | stage | prod | none
             *
             * @params {Boolean} [refresh]
             * @returns {Promise} resolved with env string, rejected if no response
             */
            this.getEnvironment = function (refresh) {

                if (_environment && !refresh) {
                    return $q.resolve(_environment);
                }

                if (_cache.env && !refresh) {
                    return _cache.env;
                }

                var timer;

                _cache.env = $q(function(resolve, reject) {

                    messageBus.send('getEnvironment').onResponse(function(env) {
                        $timeout.cancel(timer);
                        resolve(env);
                    });

                    // If we don't hear from Commerce Platform within a short
                    // time, reject the promise with no value. This allows us
                    // to assume that we're not within Commerce Platform and
                    // carry on with our business.

                    timer = $timeout(function () {
                        delete _cache.env;
                        reject('timeout');
                    }, _timeout);
                });

                return _cache.env;
            };
        }

        return new CommercePlatformService();

    }];
}



