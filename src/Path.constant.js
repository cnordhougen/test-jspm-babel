'use strict';

Object.defineProperty(exports, "__esModule", {
                    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PATH = ((0, _keys2.default)(System.packages).find(function (p) {
                    return p.match(/test-jspm-babel/);
}) || '').replace(System.baseURL, '');

exports.default = PATH;
//# sourceMappingURL=Path.constant.js.map
