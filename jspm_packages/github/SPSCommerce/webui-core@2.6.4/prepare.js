/**
 * IIFE that does a few quick things: capture the user access token from the location,
 * saves it in the browser session storage, and then removes the token from the
 * location url.
 *
 * This is critical because third-party analytics suites like to save URLs during
 * their data collection and analysis - resulting in us handing over live user
 * session tokens.
 *
 * To Use: load this script before anything else in your app.
 */
(function(){

    var AMP = '&';
    var SLASH = '/';
    var SLASHES = '//';

    var url = '';
    var port = '';
    var token = '';
    var search = '';
    var protocol = '';
    var pathname = '';
    var searchParams = [];
    var tokenKey = 'token';
    var tokenParam = 'access_token';
    var storage = sessionStorage;

    // Get the token from the window.location

    var a = document.createElement('a');
    a.href = location.href;

    a.search.slice(1).split(AMP).forEach(function (val) {
        var pair = val.split('=');
        if (pair[0] === tokenParam) {
            token = pair[1];
        } else {
            searchParams.push(val);
        }
    });

    // If we didn't find a token there's nothing to do.

    if (!token) { return; }

    // If we found a token, store it in session storage.

    storage.setItem(tokenKey, token);

    // Rebuild search string without the token

    search = searchParams.join(AMP);
    search = (search) ? '?' + search : '';

    // Ensure the port is represented sanely (thanks IE)

    port = a.port;
    port = (port && port !== '80' && port !== '443') ? ':' + port : '';

    // Ensure the pathname always has a first slash

    pathname = a.pathname;
    pathname = (pathname[0] !== SLASH) ? SLASH + pathname : pathname;

    // Ensure the protocol always has two ending slashes

    protocol = a.protocol;
    protocol = (protocol.slice(-2) !== SLASHES) ? protocol + SLASHES : protocol;

    // Rebuild the url with the new search string

    url = [protocol, a.hostname, port, pathname, search, a.hash].join('');

    // Replace the current location with our new URL

    history.replaceState({}, '', url);

}());
