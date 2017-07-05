/* eslint-env jasmine */
import angular from 'angular';
import 'angular-mocks';

import Component from 'src/core/Component';
import TestBed   from 'src/core/testing/TestBed';

describe('TestBed', () => {
    describe('.configureTestingModule() / .compileComponents()', () => {
        it('should call getModule on all declarations', done => {
            spyOn(angular.mock, 'module');

            const declarations = [ { getModule() {} }, { getModule() {} }, { getModule() {} } ];
            declarations.forEach(d => spyOn(d, 'getModule').and.returnValue(Promise.resolve()));

            TestBed.configureTestingModule({ declarations })
                .compileComponents()
                .then(() => {
                    expect(declarations.filter(d => d.getModule.calls.any()).length).toEqual(declarations.length);
                    done();
                })
                .catch(fail);
        });

        it('should register mock module including the declarations', done => {
            spyOn(angular.mock, 'module');

            class MyComponent {}
            MyComponent.selector = 'my-component';
            MyComponent.getModule = () => {};

            class MyService {}
            MyService.getModule = () => {};

            TestBed.configureTestingModule({ declarations: [ MyComponent, MyService ] })
                .compileComponents()
                .then(() => {
                    expect(angular.mock.module).toHaveBeenCalled();
                    const call = angular.mock.module.calls.mostRecent();
                    expect(call.args[0]).toBe('my-component');
                    expect(call.args[1]).toBe('MyServiceModule');
                    done();
                })
                .catch(fail);
        });

        it('should include providers in the mock module', done => {
            spyOn(angular.mock, 'module');

            class MyService {}
            const mockMyService = {};

            TestBed.configureTestingModule({ providers: [ { provide: MyService, useValue: mockMyService } ] })
                .compileComponents()
                .then(() => {
                    expect(angular.mock.module).toHaveBeenCalled();

                    const pf          = angular.mock.module.calls.mostRecent().args[0]
                        , mockProvide = { value: jasmine.createSpy('provide-value') };
                    pf(mockProvide);

                    expect(mockProvide.value).toHaveBeenCalledWith('MyService', mockMyService);

                    done();
                })
                .catch(fail);
        });
    });

    describe('.createComponent()', () => {
        it('should return a component fixture', done => {
            @Component({ template: '<div>Test</div>' })
            class MyTestComponent {
                foo = 'bar';
            }

            TestBed.configureTestingModule({ declarations: [ MyTestComponent ] })
                   .compileComponents()
                   .then(() => {
                       const fixture = TestBed.createComponent(MyTestComponent);
                       expect(fixture).toBeDefined();

                       expect(fixture.componentInstance).toBeDefined();
                       expect(fixture.componentInstance.foo).toBe('bar');

                       expect(fixture.debugElement).toBeDefined();
                       expect(fixture.debugElement.isolateScope).toBeDefined(); // only an angular jqlite object has this method

                       expect(fixture.detectChanges).toBeDefined();
                       spyOn(fixture.isolateScope, '$apply');
                       fixture.detectChanges();
                       expect(fixture.isolateScope.$apply).toHaveBeenCalled();

                       expect(fixture.nativeElement).toBeDefined();
                       expect(fixture.nativeElement instanceof HTMLElement).toBe(true);

                       done();
                   });
        });
    });
});
