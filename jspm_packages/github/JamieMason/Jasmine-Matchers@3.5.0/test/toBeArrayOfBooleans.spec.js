// modules
var describeToBeArrayOfX = require('./lib/describeToBeArrayOfX');

// spec
describe('toBeArrayOfBooleans', function () {
  describeToBeArrayOfX('toBeArrayOfBooleans', {
    type: 'Boolean',
    whenValid: function () {
      expect([true]).toBeArrayOfBooleans();
      expect([new Boolean(true)]).toBeArrayOfBooleans();
      expect([new Boolean(false)]).toBeArrayOfBooleans();
      expect([false, true]).toBeArrayOfBooleans();
    },
    whenInvalid: function () {
      expect([null]).not.toBeArrayOfBooleans();
    },
    whenMixed: function () {
      expect([null, false]).not.toBeArrayOfBooleans();
      expect([null, true]).not.toBeArrayOfBooleans();
    }
  });
});
