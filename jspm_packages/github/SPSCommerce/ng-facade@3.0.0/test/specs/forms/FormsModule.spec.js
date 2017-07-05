/* eslint-env jasmine */
import FormsModule from 'src/forms/FormsModule';
import ngfTemplate from 'src/util/directive/ngfTemplate';

describe('FormsModule', () => {
    describe('should add template replacements', () => {
        beforeAll(FormsModule.getModule);

        it('should replace [(ngModel)] with ng-model', () => {
            const template = `
                    <div [(ngModel)]="ctrl.foo"></div>
                `
                , expected = `
                    <div ng-model="ctrl.foo"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });
    });
});
