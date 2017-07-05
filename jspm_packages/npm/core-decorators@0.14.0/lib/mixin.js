/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports['default'] = mixin;
var _privateUtils = require('./private/utils');
var defineProperty = Object.defineProperty;
var getPrototypeOf = Object.getPrototypeOf;
function buggySymbol(symbol) {
  return Object.prototype.toString.call(symbol) === '[object Symbol]' && typeof symbol === 'object';
}
function hasProperty(prop, obj) {
  if (buggySymbol(prop)) {
    do {
      if (obj === Object.prototype) {
        return typeof obj[prop] !== 'undefined';
      }
      if (obj.hasOwnProperty(prop)) {
        return true;
      }
    } while (obj = getPrototypeOf(obj));
    return false;
  } else {
    return prop in obj;
  }
}
function handleClass(target, mixins) {
  if (!mixins.length) {
    throw new SyntaxError('@mixin() class ' + target.name + ' requires at least one mixin as an argument');
  }
  for (var i = 0,
      l = mixins.length; i < l; i++) {
    var descs = (0, _privateUtils.getOwnPropertyDescriptors)(mixins[i]);
    var keys = (0, _privateUtils.getOwnKeys)(descs);
    for (var j = 0,
        k = keys.length; j < k; j++) {
      var key = keys[j];
      if (!hasProperty(key, target.prototype)) {
        defineProperty(target.prototype, key, descs[key]);
      }
    }
  }
}
function mixin() {
  for (var _len = arguments.length,
      mixins = Array(_len),
      _key = 0; _key < _len; _key++) {
    mixins[_key] = arguments[_key];
  }
  if (typeof mixins[0] === 'function') {
    return handleClass(mixins[0], []);
  } else {
    return function(target) {
      return handleClass(target, mixins);
    };
  }
}
module.exports = exports['default'];
