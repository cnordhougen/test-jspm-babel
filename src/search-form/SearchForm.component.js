'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

var _core = require('ng-facade/core');

var _SearchFormTemplate = require('./SearchForm.template.html!text');

var _SearchFormTemplate2 = _interopRequireDefault(_SearchFormTemplate);

var _SearchFormStylesMin = require('./SearchForm.styles.min.css!text');

var _SearchFormStylesMin2 = _interopRequireDefault(_SearchFormStylesMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    (0, _defineProperty2.default)(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

/* eslint-disable no-multi-spaces */
var SearchFormComponent = (_dec = (0, _core.Component)({
    selector: 'xref-search-form',
    styles: [_SearchFormStylesMin2.default],
    template: _SearchFormTemplate2.default
}), _dec2 = (0, _core.Inject)({ ref: _core.ChangeDetectorRef, localization: 'localizationService' }), _dec3 = (0, _core.Input)(), _dec4 = (0, _core.Output)(), _dec5 = (0, _core.Output)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function SearchFormComponent() {
        (0, _classCallCheck3.default)(this, SearchFormComponent);

        _initDefineProp(this, 'searchValues', _descriptor, this);

        _initDefineProp(this, 'search', _descriptor2, this);

        _initDefineProp(this, 'clear', _descriptor3, this);
    }

    (0, _createClass3.default)(SearchFormComponent, [{
        key: 'ngOnInit',
        value: function ngOnInit() {
            this.localization.localize({
                component: 'search-form',
                path: './lang/'
            });
        }
    }, {
        key: 'clearForm',
        value: function clearForm() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.searchValues)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    this.searchValues[key] = null;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.clear.emit();
            this.ref.detectChanges();
        }
    }]);
    return SearchFormComponent;
}(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'searchValues', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'search', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
        return new _core.EventEmitter();
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'clear', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
        return new _core.EventEmitter();
    }
})), _class2)) || _class) || _class);
exports.default = SearchFormComponent;
//# sourceMappingURL=SearchForm.component.js.map
