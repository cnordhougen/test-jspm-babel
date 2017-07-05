var _ = require('lodash');

var SLASH = '/';
var EQUALS = '=';
var AMPERSAND = '&';
var QUESTION = '?';

module.exports = {

    /**
     * Simple function for getting query string parameters from javascript.
     * Optionally provide a url to search (defaults to current url)
     *
     * @param name
     * @param url
     * @returns {String}
     */
    getParameterByName: function getParameterByName(name, url) {

        if (url === null) {
            url = window.location.search;
        }

        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regexS = '[\\?&]' + name + '=([^&#]*)';
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results === null) {
            return '';
        }
        return decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    /**
     * Return object of all the URL search query params. No regex, compact.
     *
     * Solution taken from:
     * http://www.timetler.com/2013/11/14/location-search-split-one-liner/
     *
     * @returns {Object}
     */
    getParams: function getParams(url) {
        url = url || window.location.href;
        var parts = this.parseUrl(url).search.slice(1).split(AMPERSAND);
        var map = _.map(parts, function (item) { if (item) { return item.split(EQUALS); } });
        return _.object(_.compact(map));
    },

    /**
     * Given two urls, returns true if they have the same host and protocol
     *
     * @param url1
     * @param url2
     * @returns {boolean}
     */
    hostAndProtocolMatch: function hostAndProtocolMatch(url1, url2) {
        var a = this.parseUrl(url1);
        var b = this.parseUrl(url2);
        return (a.host === b.host && a.protocol === b.protocol);
    },

    /**
     * Joins all arguments together into a URL string. Removes duplicate slashes
     * (but leaves the double slashes in a protocol, eg: http://foo/bar/baz).
     *
     * @param {...string}
     * @returns {String}
     */
    join: function() {
        var arr = Array.apply(null, arguments);
        var str = arr.join(SLASH);
        return this.cleanSlashes(str);
    },

    /**
     * Parse a url so that its components can be accessed individually
     * from http://stackoverflow.com/questions/6644654/
     *
     * @param url
     * @returns {Element}
     */
    parseUrl: function parseUrl(url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    },

    /**
     * Add a query parameter to a url, or change it if it already exists
     * from http://stackoverflow.com/questions/5999118/
     *
     * @param url
     * @param key
     * @param val
     * @returns {string}
     */
    updateQueryString: function updateQueryString(url, key, val) {

        url = url || window.location.href;

        var query = [];
        var parts = this.parseUrl(url);
        var params = this.getParams(url);

        var host = parts.origin;
        var path = parts.pathname;
        var hash = parts.hash;

        _.set(params, key, val);
        if (val === null) { delete params[key]; }

        _.each(params, function(key, val) {
            query.push(key + EQUALS + val);
        });

        query = query.join(AMPERSAND);

        return host + path + ((query) ? QUESTION + query : '') + hash;
    },

    /**
     * Wrap a URL in slashes, ensuring no double slashes. Is careful not
     * to destroy search parameters.
     *
     * Example:
     * Url.wrapSlashes('foo/bar?baz=123'); -> '/foo/bar/?baz=123'
     *
     * @param {string} url
     * @returns {string}
     */
    wrapSlashes: function(url) {
        var split = url.split(QUESTION);
        var search = split[1];
        url = split[0];
        url = (url.substr(0,4) !== 'http') ? SLASH + url : url;
        url = url + SLASH;
        url = (search) ? url + QUESTION + search : url;
        return this.cleanSlashes(url);
    },

    /**
     * Remove double slashes from a url except when used in a protocol (https://).
     *
     * @param {string} url
     * @returns {string}
     */
    cleanSlashes: function(url) {
        return url
            .replace(/([^:]\/)\/+/g, '$1')  // remove from middle
            .replace(/^\/\//, SLASH)        // remove from beginning
            .replace(/\/\/$/, SLASH);       // remove from end
    }
};







