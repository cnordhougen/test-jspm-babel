// modules
var getArgumentsObject = require('./getArgumentsObject');
var getArrayLikeObject = require('./getArrayLikeObject');

// public
module.exports = function describeWhenNotArray(toBeArrayMemberName) {
  describe('when subject is not a true Array', function () {
    describe('when subject is Array-like', function () {
      it('should deny', function () {
        expect(getArgumentsObject()).not[toBeArrayMemberName]();
        expect(getArrayLikeObject()).not[toBeArrayMemberName]();
      });
    });
    describe('when subject is not Array-like', function () {
      it('should deny', function () {
        var _undefined;
        expect({}).not[toBeArrayMemberName]();
        expect(null).not[toBeArrayMemberName]();
        expect(_undefined).not[toBeArrayMemberName]();
        expect(true).not[toBeArrayMemberName]();
        expect(false).not[toBeArrayMemberName]();
        expect(Array).not[toBeArrayMemberName]();
      });
    });
  });
};
