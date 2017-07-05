/* eslint-env jasmine */
import angular from 'angular';
import 'angular-mocks';

import inject from 'src/core/testing/inject';

describe('inject()', () => {
    it('should call angular.mock.inject w/processed injection list + passed function', () => {
        spyOn(angular.mock, 'inject');
        function f() {}
        inject([ 'foo' ], f);
        expect(angular.mock.inject).toHaveBeenCalledWith([ 'foo', f ]);
    });
});
