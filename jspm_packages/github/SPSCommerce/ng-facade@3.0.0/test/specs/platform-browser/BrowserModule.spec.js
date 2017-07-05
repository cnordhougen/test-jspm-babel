/* eslint-env jasmine */
import BrowserModule from 'src/platform-browser/BrowserModule';
import ngfTemplate   from 'src/util/directive/ngfTemplate';

describe('BrowserModule', () => {
    describe('should add template replacements', () => {
        beforeAll(BrowserModule.getModule);

        it('should adjust basic events from ng2 to ng1 style', () => {
            const template = `
                    <div (blur)="ctrl.onBlur($event)"
                    (change)="ctrl.onChange($event)"
                    (checked)="ctrl.onChecked($event)"
                    (click)="ctrl.onClick($event)"
                    (dblclick)="ctrl.onDblClick($event)"
                    (focus)="ctrl.onFocus($event)"
                    (keydown)="ctrl.onKeyDown($event)"
                    (keypress)="ctrl.onKeyPress($event)"
                    (keyup)="ctrl.onKeyUp($event)"
                    (mousedown)="ctrl.onMouseDown($event)"
                    (mouseenter)="ctrl.onMouseEnter($event)"
                    (mouseleave)="ctrl.onMouseLeave($event)"
                    (mousemove)="ctrl.onMouseMove($event)"
                    (mouseover)="ctrl.onMouseOver($event)"
                    (mouseup)="ctrl.onMouseUp($event)"
                    (submit)="ctrl.onSubmit($event)"
                    (not-a-builtin-event)="ctrl.someHandler($event)">
                    <span>QQQQQqqqqq</span>
                    </div>
                `
                , expected = `
                    <div ng-blur="ctrl.onBlur($event)"
                    ng-change="ctrl.onChange($event)"
                    ng-checked="ctrl.onChecked($event)"
                    ng-click="ctrl.onClick($event)"
                    ng-dblclick="ctrl.onDblClick($event)"
                    ng-focus="ctrl.onFocus($event)"
                    ng-keydown="ctrl.onKeyDown($event)"
                    ng-keypress="ctrl.onKeyPress($event)"
                    ng-keyup="ctrl.onKeyUp($event)"
                    ng-mousedown="ctrl.onMouseDown($event)"
                    ng-mouseenter="ctrl.onMouseEnter($event)"
                    ng-mouseleave="ctrl.onMouseLeave($event)"
                    ng-mousemove="ctrl.onMouseMove($event)"
                    ng-mouseover="ctrl.onMouseOver($event)"
                    ng-mouseup="ctrl.onMouseUp($event)"
                    ng-submit="ctrl.onSubmit($event)"
                    not-a-builtin-event="ctrl.someHandler($event)">
                    <span>QQQQQqqqqq</span>
                    </div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });

        it('should replace [innerHTML] with ng-bind-html', () => {
            const template = `
                    <div [innerHTML]="ctrl.someHTML"></div>
                `
                , expected = `
                    <div ng-bind-html="ctrl.someHTML"></div>
                `;

            expect(ngfTemplate.transform(template)).toBe(expected);
        });
    });
});
