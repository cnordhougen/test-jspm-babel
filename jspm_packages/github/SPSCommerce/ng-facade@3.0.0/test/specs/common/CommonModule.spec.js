/* eslint-env jasmine */
import CommonModule from 'src/common/CommonModule';
import ngfTemplate  from 'src/util/directive/ngfTemplate';

describe('CommonModule', () => {
    describe('should add template replacements', () => {
        beforeAll(CommonModule.getModule);

        it('should merge consecutive [class.foo]="expr" into an Angular 1 ng-class', () => {
            const template = `
                    <div [class.selected]="ctrl.selected" [class.big]="ctrl.number >= 1000">
                    <span>QQQQQqqqqq</span>
                    </div>
                `
                , expected = `
                    <div ng-class="{ 'selected': ctrl.selected, 'big': ctrl.number >= 1000 }">
                    <span>QQQQQqqqqq</span>
                    </div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace [ngClass] with ng-class', () => {
            const template = `
                    <div [ngClass]="{ 'foo': ctrl.foo }"></div>
                `
                , expected = `
                    <div ng-class="{ 'foo': ctrl.foo }"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should merge consecutive [style.foo]="expr" into an Angular 1 ng-style', () => {
            const template = `
                    <div [style.color]="ctrl.color" [style.font-weight]="ctrl.boldness">
                    <span>QQQQQqqqqq</span>
                    </div>
                `
                , expected = `
                    <div ng-style="{ 'color': ctrl.color, 'font-weight': ctrl.boldness }">
                    <span>QQQQQqqqqq</span>
                    </div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace [ngStyle] with ng-style', () => {
            const template = `
                    <div [ngStyle]="{ 'foo': ctrl.foo }"></div>
                `
                , expected = `
                    <div ng-style="{ 'foo': ctrl.foo }"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace *ngFor with ng-repeat', () => {
            const template = `
                    <div *ngFor="let person of ctrl.people | orderBy: person.age"></div>
                `
                , expected = `
                    <div ng-repeat="person in ctrl.people | orderBy: person.age"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace *ngIf with ng-if', () => {
            const template = `
                    <div *ngIf="ctrl.something"></div>
                `
                , expected = `
                    <div ng-if="ctrl.something"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace [ngSwitch] with ng-switch', () => {
            const template = `
                    <div [ngSwitch]="ctrl.foo"></div>
                `
                , expected = `
                    <div ng-switch="ctrl.foo"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace *ngSwitchCase with ng-switch-when', () => {
            const template = `
                    <div *ngSwitchCase="ctrl.something"></div>
                `
                , expected = `
                    <div ng-switch-when="ctrl.something"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace *ngSwitchDefault with ng-switch-default', () => {
            const template = `
                    <div *ngSwitchDefault></div>
                `
                , expected = `
                    <div ng-switch-default></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });
    });
});
