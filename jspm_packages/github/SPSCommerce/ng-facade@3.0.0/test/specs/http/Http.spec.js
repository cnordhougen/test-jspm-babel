/* eslint-env jasmine */
import Http          from 'src/http/Http';
import A1InjectToken from 'src/util/injection/A1InjectToken';

describe('Http', () => {
    it('should be an A1InjectToken for $http', () => {
        expect(Http instanceof A1InjectToken).toBe(true);
        expect(Http.key).toBe('$http');
    });
});
