var get = require('lodash/object/get');
var cap = require('lodash/string/capitalize');

module.exports = Controller;

Controller.$inject = ['$q', '$http'];

function Controller($q, $http) {

    var _this = this;

    // *************************
    // EXAMPLE 1
    // *************************

    this.ex1 = {};
    this.ex1.api = {};
    this.ex1.selected = false;

    this.ex1.whenReady = function (api) {
        _this.ex1.api = api;
    };

    this.ex1.source = [
        'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
        'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

    // *************************
    // EXAMPLE 2
    // *************************

    this.ex2 = {};
    this.ex2.api = {};
    this.ex2.selected = false;
    this.ex2.source = require('./data/users.json');

    this.ex2.whenReady = function (api) {
        _this.ex2.api = api;
    };

    this.ex2.formatIdKey = function(user) {
        return get(user, 'id.value', '');
    };

    this.ex2.formatTextKey = function(user) {
        var fname = get(user, 'name.first', '');
        var lname = get(user, 'name.last', '');
        return (fname || lname) ? (cap(fname) + ' ' + cap(lname)).trim() : '';
    };

    this.ex2.random = function() {
        var items = _this.ex2.source;
        var item = items[Math.floor(Math.random() * items.length)];
        _this.ex2.selected = item;
    };

    // *************************
    // EXAMPLE 3
    // *************************

    this.ex3 = {};
    this.ex3.api = {};
    this.ex3.selected = false;
    this.ex3.whenReady = function (api) {
        _this.ex3.api = api;
    };

    this.ex3.source = function(search) {

        var config = {
            params: {
                q: search,
                type: 'artist',
                token: 'teeiSeZwkvGXmmfZYIGPQuMWpBivTIYWYQaAAbOd'
            },
            useToken: false // Prevent the Commerce Platform token from being sent
        };

        return $http.get('https://api.discogs.com/database/search', config).then(function(resp) {
            if (resp.data && resp.data.results) {
                return resp.data.results;
            }
        });
    };

    this.ex3.searchAndAlert = function() {
        _this.ex3.api.searchAndSelect('The Rolling Stones').then(function(data){
            window.alert('Got Result:\n' + JSON.stringify(data));
        });
    };

}
