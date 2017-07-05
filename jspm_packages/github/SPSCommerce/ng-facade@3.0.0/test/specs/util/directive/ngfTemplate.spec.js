/* eslint-env jasmine */
import ngfTemplate from 'src/util/directive/ngfTemplate';

describe('ngfTemplate', () => {
    describe('get()', () => {
        it('should resolve with the inline template if it exists', done => {
            const cdef = { template: 'abc' };
            ngfTemplate.get(cdef)
                       .then(template => {
                           expect(template).toBe(cdef.template);
                           done();
                       })
                       .catch(fail);
        });

        it('should resolve with imported template if url is given', done => {
            ngfTemplate.get({ templateUrl: 'testTemplate.html' }, 'test/')
                       .then(template => {
                           expect(template.trim()).toBe('<div>foo</div>');
                           done();
                       })
                       .catch(fail);
        });

        it('should reject if the component definition lacks a template or templateUrl', done => {
            ngfTemplate.get({})
                       .then(() => fail('getTemplate did not fail when it should have'))
                       .catch(done);
        });
    });

    describe('transform() default replacements', () => {
        it('should strip [] and () from attribute names', () => {
            const template = `
                    <div [a]="" (b)="" [(c)]=""></div>
                `
                , expected = `
                    <div a="" b="" c=""></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace ng-content with ng-transclude', () => {
            const template = `
                    <div><ng-content></ng-content></div>
                `
                , expected = `
                    <div><ng-transclude></ng-transclude></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });
    });
});
