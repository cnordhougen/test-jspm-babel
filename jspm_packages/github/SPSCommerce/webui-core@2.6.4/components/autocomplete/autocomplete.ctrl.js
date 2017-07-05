var $ = require('jquery');
var _ = require('lodash');
var stringMatch = require('../../utils/stringMatch');

module.exports = AutocompleteController;

AutocompleteController.$inject = ['$q', '$timeout', '$translate', '$rootScope', '$scope'];

function AutocompleteController ($q, $timeout, $translate, $rootScope, $scope) {

    var TYPE_STRING = 'string';
    var TYPE_OBJECT = 'object';
    var TYPE_FUNCTION = 'function';

    var _this = this;
    var _suggestions = [];
    var _query = '';
    var _ngModel;
    var _$input;
    var _api;

    /**
     * Setup the controller, set default values for the directive scope vars
     * and trigger the onReady() callback with the api.
     *
     * @param {Element} $input
     * @param {Object} ngModel
     */
    this.setup = function ($input, ngModel) {

        _$input = $input;
        _ngModel = ngModel;

        _.defaults(_this, {
            limit: 10,
            hint: false,
            ngModel: {},
            minchars: 3,
            idKey: 'id',
            textKey: 'value',
            selectOnEnter: false,
            allowUserInput: false,
            modelType: TYPE_STRING,
            debounce: (Array.isArray(_this.source)) ? 0 : 300
        });

        _this.setTemplateTranslation();
        _this.triggerOnReady(_api);
    };


    /**
     * Set the "No Result" and "Searching" translated values to be used
     * with the typeahead.js module.
     */
    this.setTemplateTranslation = function() {
        $translate('webui.components.autocomplete.noResults').then(function (noResults) {
            _this.noResults = noResults;
        });

        $translate('webui.components.autocomplete.searching').then(function (searching) {
            _this.searching = searching;
        });
    };

    /**
     * Add global watcher to change template translations when the lang is updated
     */
    var unwatch = $rootScope.$on('$translateChangeSuccess', function() {
        _this.setTemplateTranslation();
    });

    /**
     * Remove listener when destroyed
     */
    $scope.$on('$destroy', function() {
        unwatch();
    });

    /**
     * Get the formatted text value from an item (or a string).
     *
     * @param {Object} item
     * @returns {String}
     */
    this.getTextValue = function (item) {
        var isStr = (typeof item === TYPE_STRING);
        return isStr ? item : _getFormattedValue(_this.textKey, item);
    };

    /**
     * Get the formatted id value from an item.
     *
     * @param {Object} item
     * @returns {String}
     */
    this.getIdValue = function (item) {
        return _getFormattedValue(_this.idKey, item);
    };

    /**
     * Text and Id formatters can be functions or strings. If the formatter is
     * a function, execute it to get the value. If the formatter is a string
     * then treat it like a key in an object. Otherwise just return the item
     * outright.
     *
     * @param {Function|String} formatter
     * @param {Object} item
     * @returns {String}
     * @private
     */
    function _getFormattedValue (formatter, item) {
        var result = '';
        if (item) {
            switch (typeof formatter) {
                case TYPE_FUNCTION:
                    result = formatter(item);
                    break;
                case TYPE_STRING:
                    result = _.get(item, formatter) || '';
                    break;
                default:
                    result = item;
                    break;
            }
        }
        return String(result);
    }

    /**
     * Execute the onReady callback if one was supplied.
     */
    this.triggerOnReady = function () {
        if (typeof _this.onReady === TYPE_FUNCTION) {
            _this.onReady.apply(_this, arguments);
        }
    };

    /**
     * Execute the onChange callback if one was supplied.
     */
    this.triggerOnChange = function () {
        if (typeof _this.onChange === TYPE_FUNCTION) {
            _this.onChange.apply(_this, arguments);
        }
    };

    /**
     * Update the ngModel controller to use the specified value. Trigger the
     * onChange callback if one is specified.
     *
     * @param {Object} item
     * @returns {Promise} resolved when module is updated
     */
    this.updateModel = function (item) {
        return $q(function(resolve){
            $timeout(function () {
                if (_ngModel) {

                    // Convert item from string to object
                    if (typeof item === TYPE_STRING && _this.modelType === TYPE_OBJECT) {
                        var itemObj = {};
                        itemObj[_this.textKey] = item;
                        item = itemObj;
                    }

                    // Convert item from object to string
                    if (typeof item === TYPE_OBJECT && _this.modelType === TYPE_STRING) {
                        item = _this.getTextValue(item);
                    }

                    _ngModel.$setViewValue(item);
                }
                _this.triggerOnChange(item);
                resolve(item);
            });
        });
    };

    /**
     * The source for typeahead.js can be a function that returns an array,
     * a function that returns a promise, or a simple array. This handles
     * some dirty work when working with all three of those possible sources.
     *
     * @returns {Function}
     */
    this.getSource = function () {

        var result = [];

        return _.debounce(function (query, syncResults, asyncResults) {

            _query = query;

            // We want to always bump any EXACT string matches to the very
            // top of our list of suggestions. Use the _getSortedCallback()
            // method to do the dirty work and keep it DRY.

            var sortAndComplete = _getSortedCallback(query, asyncResults);

            if (typeof _this.source === TYPE_FUNCTION) {

                result = _this.source(query);

                if (result && result.then) {
                    result.then(sortAndComplete);
                    return;
                }

            } else {

                // Source was not a function, so it is likely a collection.
                // Let's use the simpleTextSearch() method to filter.

                result = _this.simpleTextSearch(query, _this.source);

            }

            sortAndComplete(result);

        }, _this.debounce);
    };

    /**
     * Function factory for sorting exact matches to the top of a result set.
     * This is used by getSource() to keep things DRY. This also fires the
     * event autocomplete:suggestions, which is used to return results to
     * the searchFor() promise.
     *
     * @param {String} query
     * @param {Function} asyncResults
     * @returns {Function}
     * @private
     */
    function _getSortedCallback (query, asyncResults) {
        return function (result) {
            if (Array.isArray(result)) {
                result = _this.convertToArrayOfObjects(result);
                result = _this.simpleTextSearch(query, result);
                result = _this.sortExactMatchFirst(query, result);
                result = _this.addUserInputOption(query, result);
            }
            asyncResults(result);
            _suggestions = result;
            _$input.trigger('autocomplete:suggestions', [result]);
        };
    }

    /**
     * Converts an array of strings to an array of objects, which is what the typeahead
     * plugin needs to render suggestions.
     *
     * @param {Array|Object} collection
     * @returns {Array}
     * @private
     */
    _this.convertToArrayOfObjects = function (collection) {
        return _.map(collection, function(val) {
            if (typeof val === 'string') {
                var obj = {};
                obj[_this.textKey] = val;
                return obj;
            }
            return val;
        });
    };

    /**
     * Sort a result set by finding an exact match between user query and item value
     * and bumping it to the top of the list. All other items remain in the same
     * position they were sent.
     *
     * @param {String} query
     * @param {Array} collection
     * @returns {Array}
     */
    this.sortExactMatchFirst = function (query, collection) {
        return _.sortBy(collection, function (item, i) {
            return (stringMatch(query, _this.getTextValue(item))) ? 0 : i + 1;
        });
    };

    /**
     * When configured to allow user input, we need to prepend a suggestion to the
     * list that matches the users's query. This is a bit of a hack because the
     * typeahead component will automatically select the first suggestion when
     * tab is pressed.
     *
     * @param {String} query
     * @param {Array} collection
     * @returns {Array}
     */
    this.addUserInputOption = function (query, collection) {
        collection = collection || [];
        if (_this.allowUserInput) {
            var item = collection[0] || {};
            var text = _this.getTextValue(item);
            if (!stringMatch(text, query)) {
                var newSuggestion = {};
                newSuggestion[_this.textKey] = query;
                collection.unshift(newSuggestion);
            }
        }
        return collection;
    };

    /**
     * This simple text search is provided for filtering collections so that the end
     * user need not provide one just for basic use. This does a case-insensitive
     * substring search, returning an array (collection) with all matches.
     *
     * @param {String} query
     * @param {Array} collection
     * @returns {Array}
     */
    this.simpleTextSearch = function(query, collection) {
        query = query.toLowerCase();
        return _.map(collection, function(item) {
            var obj = {};
            var str = _this.getTextValue(item);
            if (typeof item === TYPE_STRING) {
                obj[_this.textKey] = item;
            } else if (typeof item === TYPE_OBJECT) {
                obj = item;
            }
            return (str.toLowerCase().indexOf(query) > -1) ? obj : false;
        }).filter(Boolean);
    };


    // ****************************************************************
    // Public Component API
    // ****************************************************************

    _api = this.api = {
        state: {},
        selected: {},
        focus: _focus,
        openMenu: _openMenu,
        searchFor: _searchFor,
        closeMenu: _closeMenu,
        selectItem: _selectItem,
        clearSearch: _clearSearch,
        searchAndSelect: _searchAndSelect,
        selectSuggestion: _selectSuggestion
    };

    Object.defineProperties(_api.state, {
        open: {
            get: function () {
                return _getMenu().is(':visible');
            }
        },
        onlyExactMatch: {
            get: function () {
                var item = _suggestions[0];
                if (!item || _suggestions.length > 1) { return false; }
                return stringMatch(_query, _this.getTextValue(item));
            }
        }
    });

    Object.defineProperties(_api.selected, {
        id: {
            get: function () {
                return _this.getIdValue(_ngModel.$viewValue);
            }
        },
        value: {
            get: function () {
                return _this.getTextValue(_ngModel.$viewValue);
            }
        }
    });

    /**
     * Give focus to the autocomplete input.
     *
     * @private
     */
    function _focus () {
        _$input.focus();
    }

    /**
     * Get jquery DOM element for the suggestion menu.
     *
     * @returns {jQuery.selection}
     * @private
     */
    function _getMenu () {
        return _$input.siblings('.tt-menu');
    }

    /**
     * Get jquery DOM elements for suggestion items.
     *
     * @returns {jQuery.selection}
     * @private
     */
    function _getSuggestionElements () {
        return _getMenu().find('.tt-suggestion');
    }

    /**
     * Open the suggestion menu.
     *
     * @private
     */
    function _openMenu () {
        _$input.typeahead('open');
    }

    /**
     * Close the suggestion menu.
     *
     * @private
     */
    function _closeMenu () {
        _$input.typeahead('close');
    }

    /**
     * Clear the autocomplete search and selected item.
     *
     * @private
     */
    function _clearSearch () {
        _this.updateModel(null);
    }

    /**
     * Select a suggestion by directly passing in the item.
     * (As opposed to searching for it by string first).
     *
     * @param {Object} item
     * @private
     */
    function _selectItem (item) {
        _this.updateModel(item);
    }

    /**
     * Enters a string value into the autocomplete field which will trigger
     * a search to be performed on the value. The autocomplete suggestions
     * will render in the dropdown menu. If the optional silent argument is
     * passed, the suggestion menu will be supressed and the search will be
     * performed "in the background" (silently).
     *
     * Returns a promise that is resolved with a collection of suggestions.
     * Promise is rejected if the query is same as current selection.
     *
     * @param {String} query
     * @param {Boolean} [silent]
     * @returns {Promise}
     * @private
     */
    function _searchFor (query, silent) {

        _$input.typeahead('val', query);

        return $q(function (resolve, reject) {

            if (query === _api.selected.value) {
                reject();
            } else {

                if (!silent) {
                    _focus();
                    _openMenu();
                }

                _$input.on('autocomplete:suggestions', function (e, suggestions) {
                    resolve(suggestions);
                    _$input.off(e);
                });
            }
        });
    }

    /**
     * Silenty search for a given string query and select the specified suggestion.
     * If no suggestion index is specified, the first suggestion will be selected.
     * Returns a promise that is resolved with the selected item.
     *
     * @param {String} query
     * @param {Number} [i]
     * @returns {Promise}
     * @private
     */
    function _searchAndSelect (query, i) {
        return _searchFor(query, true).then(function () {
            return _selectSuggestion(i);
        });
    }

    /**
     * Select a suggestion (by index, starting at 0) from the autocomplete
     * menu of suggestions. If no index is specified, the first suggestion
     * will be selected. Fails silently if no suggestions available.
     * Returns a promise that is resolved with the selected item.
     *
     * @param {Number} [i]
     * @returns {Promise}
     * @private
     */
    function _selectSuggestion (i) {
        return $q(function (resolve) {
            _$input.on('typeahead:select', function (e, selection) {
                resolve(selection);
                _$input.off(e);
            });
            $(_getSuggestionElements()[i || 0]).click();
            _focus();
        });
    }

}
