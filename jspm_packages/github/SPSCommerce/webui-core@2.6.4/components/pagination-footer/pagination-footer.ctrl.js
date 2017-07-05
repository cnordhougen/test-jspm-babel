var _ = require('lodash');
var angular = require('angular');

module.exports = PaginationController;

PaginationController.$inject = [
    '$scope',
    '$state',
    'localizationService'
];

function PaginationController ($scope, $state, localizationService) {

    var _this = this;

    /**
     * Container object for the read-only state properties
     * @type {Object}
     * @private
     */
    var _state = {};

    /**
     * Starting values for the component, set during init()
     *
     * @type {Object}
     */
    var _initialVals = {};

    /**
     * Holds the state name where this component was initialized loaded from.
     * Important for discerning changes to search params that are not for us.
     *
     * @type {String}
     * @private
     */
    var _initialState;

    /**
     * Callback method that fires when pagination changes and the change is not silent
     *
     * @type {function}
     */
    this.onChange = this.onChange || angular.noop;

    /**
     * Callback method that fires when pagination methods and state are available
     *
     * @type {function}
     */
    this.onReady = this.onReady || angular.noop;

    /**
     * An Array of integers which become the options in the page size dropdown
     *
     * @type {Array.<number>}
     */
    this.sizeOptions = Array.isArray(this.sizeOptions) ? this.sizeOptions : [25, 50, 100];

    /**
     * Container object for exposed methods and state of pagination
     *
     * @type {Object}
     */
    this.api = this.api || {};

    _.assign(this.api || {}, {
        state: {},
        nextPage: _nextPage,
        prevPage: _prevPage,
        setPageSize: _setPageSize,
        setPageNumber: _setPageNumber,
        setTotalItems: _setTotalItems
    });

    /**
     * Make the api.state properties read-only
     */
    Object.defineProperties(this.api.state, {
        startIndex: {
            get: function () {
                return _state.startIndex;
            }
        }, endIndex: {
            get: function () {
                return _state.endIndex;
            }
        }, pageNumber: {
            get: function () {
                return _state.pageNumber;
            }
        }, pageSize: {
            get: function () {
                return _state.pageSize;
            }
        }, totalItems: {
            get: function () {
                return _state.totalItems;
            }
        }, totalPages: {
            get: function () {
                return _state.totalPages;
            }
        }
    });

    _init();

    /**
     * Init the component
     */
    function _init () {

        localizationService.localize({
            component: 'webui-pagination-footer'
        });

        _initialVals = _getInitialValues();
        _initialState = $state.current.name;

        _state = {
            totalPages: 0,
            totalItems: -1,
            endIndex: _initialVals.end,
            pageSize: _initialVals.size,
            pageNumber: _initialVals.page,
            startIndex: _initialVals.start
        };

        _setPageNumber(_state.pageNumber, true);
        _startParamWatch();
        _triggerOnReady();
    }

    /**
     * Create an object of initial pagination settings, taking into account
     * for the possibility of values saved in the search params.
     *
     * @returns {Object}
     * @private
     */
    function _getInitialValues() {

        var vals = {
            page: 1,
            size: _this.sizeOptions[0]
        };

        if (_this.searchParams) {
            vals.page = Number(_this.searchParams.page) || vals.page;
            vals.size = Number(_this.searchParams.page_size) || vals.size;
        }

        vals.start = ((vals.page - 1) * vals.size);
        vals.end = vals.start + vals.size;

        return vals;
    }

    /**
     * Watch the searchParams object for changes. If a change is detected and this
     * component is enabled, then silently apply changes found in the params.
     *
     * @private
     */
    function _startParamWatch() {

        if (!_this.searchParams) { return; }

        var stopWatching = $scope.$watchCollection(function () {
            return _this.searchParams;
        }, function (val, oldVal) {
            if (!_isEnabled() || !val || _.isEqual(val, oldVal)) { return; }
            var page = Number(_this.searchParams.page);
            var size = Number(_this.searchParams.page_size);
            _applyChanges(page, size, true);
        });

        $scope.$on('$destroy', function () {
            stopWatching();
        });
    }

    /**
     * Is the current component enabled, as determined by whether the current state
     * matches the state the component was originially initialized. Used mostly for
     * location watches and updating search params.
     *
     * @returns {Boolean}
     * @private
     */
    function _isEnabled() {
        return Boolean($state.current.name === _initialState);
    }

    /**
     * Sets the page number which will be displayed
     *
     * @param {Number} number
     * @param {Boolean} [silent] true will make changes without triggering onchange
     */
    function _setPageNumber(number, silent) {
        _applyChanges(number, _state.pageSize, silent);
    }

    /**
     * Sets the number of items to display per page
     *
     * @param {Number} size
     * @param {Boolean} [silent] true will make changes without triggering onchange
     */
    function _setPageSize(size, silent) {
        var number = Math.ceil(_state.startIndex / size) + 1;
        _applyChanges(number, size, silent);
    }

    /**
     * Set the total number of items available. If set to -1 pagination
     * will change to the "unknown total" state.
     *
     * @param {Number} total
     */
    function _setTotalItems(total) {
        _state.totalItems = total;

        var haveItems = (_state.totalItems > 0);
        var startTooFar = (_state.startIndex >= _state.totalItems);

        if (haveItems && startTooFar) {
            _setPageNumber(_getPageCount());
        } else {
            _applyChanges(_state.pageNumber, _state.pageSize, true);
        }
    }

    /**
     * Go to the next page.
     *
     * @param {Boolean} [silent] true will make changes without triggering onchange
     */
    function _nextPage(silent) {
        _applyChanges(_state.pageNumber + 1, _state.pageSize, silent);
    }

    /**
     * Go to the prev page.
     *
     * @param {Boolean} [silent] true will make changes without triggering onchange
     */
    function _prevPage(silent) {
        _applyChanges(_state.pageNumber - 1, _state.pageSize, silent);
    }

    /**
     * Applies all changes to the state
     *
     * @param {Number} number
     * @param {Number} [size]
     * @param {Boolean} [silent]
     */
    function _applyChanges (number, size, silent) {

        if (!number) { return; }

        size = Number(size);
        number = Number(number);

        var changed = false;
        var startIndex = _state.startIndex;
        var prevState = angular.copy(_state);

        if (size !== _state.pageSize) {

            _state.pageSize = size;

        } else {

            var pageOffset = number - prevState.pageNumber;
            var indexOffset = pageOffset * _state.pageSize;
            startIndex = _state.startIndex + indexOffset;

            if (startIndex < 0) {
                startIndex = 0;
                number = 1;
            }
        }

        _state.pageNumber = number;
        _state.startIndex = startIndex;
        _state.endIndex = _getEndIndex();
        _state.totalPages = _getPageCount();

        changed = (_state.pageSize !== prevState.pageSize) ||
            (_state.pageNumber !== prevState.pageNumber) ||
            (_state.totalPages !== prevState.totalPages);

        if (changed) {

            _updateSearchParams();

            if (!silent) {
                _triggerOnChange(_state, prevState);
            }
        }
    }

    /**
     * Trigger the onReady callback.
     *
     * @private
     */
    function _triggerOnReady () {
        if (typeof _this.onReady === 'function') {
            _this.onReady(_this.api);
        }
    }

    /**
     * Trigger the onChange callback.
     *
     * @param {Object} newState
     * @param {Object} prevState
     * @private
     */
    function _triggerOnChange (newState, prevState) {
        if (typeof _this.onChange === 'function') {
            _this.onChange(newState, prevState);
        }
    }

    /**
     * Update the search params (if the user has enabled them).
     *
     * @private
     */
    function _updateSearchParams () {
        if (!_isEnabled() || !_this.searchParams) { return; }
        _this.searchParams.page = String(_state.pageNumber);
        _this.searchParams.page_size = String(_state.pageSize);

        if ($state.get('.').name) {
            // ensure that this $state is valid to transition to
            $state.go('.', _this.searchParams, {notify: false});
        }
    }

    /**
     * Does the math necessary to determine how many total pages are of data to offer
     *
     * @returns {Number} total available pages given the page size and index
     */
    function _getPageCount () {
        var total = _state.totalItems;
        var perPage = _state.pageSize;
        var offset = _state.startIndex % perPage;
        var remainder = (total + offset) % perPage;
        var endPage = (remainder === 0 ? 0 : 1);
        var firstPage = (offset === 0 ? 0 : 1);
        return firstPage + Math.floor(total / perPage) + endPage;
    }

    /**
     * Does the math to determine the index of the last result being displayed
     *
     * @returns {Number} index of the last displayed item
     */
    function _getEndIndex () {
        var index = (_state.startIndex + _state.pageSize);
        if ((index > _state.totalItems) && (_state.totalItems !== -1)) {
            index = _state.totalItems;
        }
        return index;
    }

    /**
     * A getter/setter function for pageNumber when attached to ng-model of an input
     */
    this.editablePageNumber = function (num) {
        return arguments.length ? (_setPageNumber(num)) : _state.pageNumber;
    };

    /**
     * A getter/setter function for pageSize when attached to ng-model of a select
     */
    this.editablePageSize = function (size) {
        return arguments.length ? (_setPageSize(size)) : _state.pageSize;
    };

}
