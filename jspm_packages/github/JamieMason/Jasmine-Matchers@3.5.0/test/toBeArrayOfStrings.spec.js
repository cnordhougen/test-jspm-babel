// modules
var describeToBeArrayOfX = require('./lib/describeToBeArrayOfX');

// spec
describe('toBeArrayOfStrings', function () {
  describeToBeArrayOfX('toBeArrayOfStrings', {
    type: 'String',
    whenValid: function () {
      expect(['truthy']).toBeArrayOfStrings();
      expect([new String('truthy')]).toBeArrayOfStrings();
      expect([new String('')]).toBeArrayOfStrings();
      expect(['', 'truthy']).toBeArrayOfStrings();
    },
    whenInvalid: function () {
      expect([null]).not.toBeArrayOfStrings();
    },
    whenMixed: function () {
      expect([null, '']).not.toBeArrayOfStrings();
    }
  });
});
