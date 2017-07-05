/* eslint-env jasmine *//* global inject */
import angular      from 'angular';
import 'angular-mocks';
import EventEmitter from 'eventemitter3';

import Component    from 'src/core/Component';
import HostBinding  from 'src/core/HostBinding';
import HostListener from 'src/core/HostListener';
import Inject       from 'src/core/Inject';
import Input        from 'src/core/Input';
import Output       from 'src/core/Output';
import MetadataKey  from 'src/util/metadata/MetadataKey';
import ngfMetadata  from 'src/util/metadata/ngfMetadata';
import ngfModule    from 'src/util/module/ngfModule';

const ident = x => x;

describe('The @Component decorator', () => {
    let init, finish;
    beforeAll(() => {
        init = ngfModule.init;
        ngfModule.init = function (name, T, funcs) {
            finish = funcs.finish || ident;
            funcs.finish = ident;
            return init(name, T, funcs);
        };
    });
    afterAll(() => (ngfModule.init = init));

    it('should copy the selector property to the component class', () => {
        @Component({ selector: 'my-component' })
        class MyComponent {}

        expect(MyComponent.selector).toBe('my-component');
    });

    xit('should call loadStyles directly if inline styles exist', () => {
        spyOn(Component, 'loadStyles');
        /* eslint-disable no-multi-spaces */
        @Component({
            selector: 'my-component',
            styles:   [ 'h1 { font-size: 22px; }' ]
        }) /* eslint-enable no-multi-spaces */
        class MyComponent {}

        expect(Component.loadStyles).toHaveBeenCalled();
    });

    xit('should load style files if styleUrls is provided, then call loadStyles', done => {
        spyOn(Component, 'loadStyles');
        /* eslint-disable no-multi-spaces */
        @Component({
            selector:  'my-component',
            moduleId:  'test/',
            styleUrls: [
                'testStyle1.css',
                'testStyle2.css'
            ]
        }) /* eslint-enable no-multi-spaces */
        class MyComponent {}

        MyComponent.stylesLoad.then(() => {
            expect(Component.loadStyles).toHaveBeenCalled();

            const loadedStyles = Component.loadStyles.calls.mostRecent().args[0].styles
                , expectedStyles = [
                    'h1 {\n' +
                    '    font-size: 18px;\n' +
                    '}\n',
                    '.code {\n' +
                    '    font-family: monospace;\n' +
                    '}\n'
                ];
            expect(loadedStyles).toEqual(expectedStyles);

            done();
        }).catch(fail);
    });

    describe('directive link function', () => {
        let $compile, $scope;
        beforeEach(inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $scope = _$rootScope_.$new();
        }));

        it('should ensure default input values', done => {
            @Component({
                selector: 'my-component-defs',
                template: '<div></div>'
            })
            class MyComponent {
                @Input() foo = 'abc';
                @Input() bar = 'def';
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]($compile)
                    , element   = angular.element(document.createElement('my-component-defs'));

                $scope.ctrl = ngfModule.instantiator(MyComponent)();
                // Simulate host component binding with value of undefined, which should not
                // override the default value defined in MyComponent of 'abc'
                $scope.ctrl.foo = undefined; // eslint-disable-line no-undefined
                $scope.ctrl.bar = 'xyz';

                directive.link($scope, element, {}, $scope.ctrl);

                expect($scope.ctrl.foo).toBe('abc');
                expect($scope.ctrl.bar).toBe('xyz');
                done();
            }).catch(fail);
        });

        it('should wire up attribute host bindings', done => {
            @Component({
                selector: 'my-component-ahbs',
                template: '<div></div>'
            })
            class MyComponent {
                @HostBinding('attr.foo') fooValue = 'bar';
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]($compile)
                    , element   = angular.element(document.createElement('my-component-ahbs'));

                $scope.ctrl = new MyComponent();

                directive.link($scope, element, {}, $scope.ctrl);

                expect(element.attr('foo')).toBe('{{ ctrl.fooValue }}');
                done();
            }).catch(fail);
        });

        it('should wire up class host bindings', done => {
            @Component({
                selector: 'my-component-chbs',
                template: '<div></div>'
            })
            class MyComponent {
                @HostBinding('class.foo') foo = true;
                @HostBinding('class.bar') bar = false;
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]($compile)
                    , element   = angular.element(document.createElement('my-component-chbs'));

                $scope.ctrl = new MyComponent();

                directive.link($scope, element, {}, $scope.ctrl);

                expect(element.attr('ng-class')).toBe('{\'foo\': ctrl.foo, \'bar\': ctrl.bar}');
                done();
            }).catch(fail);
        });

        it('should wire up host listeners', done => {
            @Component({
                selector: 'my-component-hls',
                template: '<div></div>'
            })
            class MyComponent {
                @HostListener('click') clickHandler() {
                    done();
                }
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]()
                    , element   = angular.element(document.createElement('my-component-hls'))
                    , scope     = { ctrl: new MyComponent() };

                directive.link(scope, element, {}, scope.ctrl);

                (element[0] || element.nativeElement).dispatchEvent(new Event('click'));
            }).catch(fail);
        });

        it('should wire up outputs', done => {
            @Component({
                selector: 'my-component-outputs',
                template: '<div></div>'
            })
            class MyComponent {
                @Output() myOutput = new EventEmitter();
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]()
                    , element   = angular.element(document.createElement('my-component-outputs'))
                    , event     = { foo: 'bar' }
                    , scope     = { ctrl: new MyComponent() };

                scope.ctrl.myOutputHandler = emittedEvent => {
                    expect(emittedEvent).toEqual({ $event: event });
                    done();
                };

                directive.link(scope, element, {}, scope.ctrl);

                scope.ctrl.myOutput.emit(event);
            }).catch(fail);
        });

        it('should call ngOnInit', done => {
            @Component({
                selector: 'my-component-oninit',
                template: '<div></div>'
            })
            class MyComponent {
                ngOnInit() {}
            }

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]()
                    , element   = angular.element(document.createElement('my-component-oninit'))
                    , scope     = { ctrl: new MyComponent() };

                spyOn(scope.ctrl, 'ngOnInit');

                directive.link(scope, element, {}, scope.ctrl);

                expect(scope.ctrl.ngOnInit).toHaveBeenCalled();
                done();
            }).catch(fail);
        });

        it('should assign view children\'s values', done => {
            const testChildCtrl = {};

            @Component({
                selector: 'my-component-vcs',
                template: `
                    <div>
                      <test-child-one></test-child-one>
                      <test-child-two></test-child-two>
                    </div>
                `
            })
            class MyComponent {}
            
            ngfMetadata.define(MetadataKey.VIEW_CHILDREN, {
                one:   'test-child-one',   // This one will be present and have a controller
                two:   'test-child-two',   // This one will be present but have no controller
                three: 'test-child-three', // This one will be absent
            }, MyComponent);

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]()
                    , element   = angular.element(`
                                      <my-component-vcs>
                                        <div>
                                          <test-child-one></test-child-one>
                                          <test-child-two></test-child-two>
                                        </div>
                                      </my-component-vcs>
                                  `)
                    , scope     = { ctrl: new MyComponent() };

                spyOn(angular, 'element').and.callFake(() => {
                    if (angular.element.calls.count() === 1) {
                        return {
                            isolateScope() {
                                return { ctrl: testChildCtrl };
                            }
                        };
                    }
                    angular.element.and.callThrough();
                    return {
                        isolateScope() {
                            return;
                        }
                    };
                });

                expect(() => directive.link(scope, element, {}, scope.ctrl)).not.toThrow();

                expect(scope.ctrl.one).toBe(testChildCtrl);
                expect(scope.ctrl.two).toBeUndefined();
                expect(scope.ctrl.three).toBeUndefined();

                done();
            }).catch(fail);
        });

        it('should assign view children values after ngOnInit and before ngAfterViewInit', done => {
            const testChildCtrl = {};

            @Component({
                selector: 'my-component-vcst',
                template: `
                    <div>
                      <test-child-one></test-child-one>
                    </div>
                `
            })
            class MyComponent {
                ngOnInit() {
                    expect(this.one).toBeUndefined();
                }

                ngAfterViewInit() {
                    expect(this.ngOnInit).toHaveBeenCalled();
                    expect(this.one).toBe(testChildCtrl);
                    done();
                }
            }
            
            ngfMetadata.define(MetadataKey.VIEW_CHILDREN, { one: 'test-child-one' }, MyComponent);

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]()
                    , element   = angular.element(`
                                      <my-component-vcst>
                                        <div>
                                          <test-child-one></test-child-one>
                                        </div>
                                      </my-component-vcst>
                                  `)
                    , scope     = { ctrl: new MyComponent() };

                spyOn(angular, 'element').and.callFake(() => {
                    angular.element.and.callThrough();
                    return {
                        isolateScope() {
                            return { ctrl: testChildCtrl };
                        }
                    };
                });

                spyOn(scope.ctrl, 'ngOnInit').and.callThrough();

                directive.link(scope, element, {}, scope.ctrl);
            }).catch(fail);
        });
    });

    describe('getModule', () => {
        it('should load the providers & directives', done => {
            class MyService {
                static getModule() {}
            }
            class MyDirective {
                static getModule() {}
            }
            /* eslint-disable no-multi-spaces */
            @Component({
                selector:   'my-component-pl',
                template:   '<div></div>',
                providers:  [ MyService ],
                directives: [ MyDirective ]
            }) /* eslint-enable no-multi-spaces */
            class MyComponent {}

            spyOn(MyService, 'getModule').and.returnValue(Promise.resolve({}));
            spyOn(MyDirective, 'getModule').and.returnValue(Promise.resolve({}));

            MyComponent.getModule().then(() => {
                expect(MyService.getModule).toHaveBeenCalled();
                expect(MyDirective.getModule).toHaveBeenCalled();
                done();
            }).catch(fail);
        });

        xit('should call getTemplate and alterTemplate', done => {
            spyOn(Component, 'getTemplate').and.callThrough();
            spyOn(Component, 'alterTemplate').and.callThrough();

            @Component({
                selector: 'my-component-gt',
                template: '<div></div>'
            })
            class MyComponent {}

            MyComponent.getModule().then(() => {
                expect(Component.getTemplate).toHaveBeenCalled();
                expect(Component.alterTemplate).toHaveBeenCalled();
                done();
            }).catch(fail);
        });

        xit('should NOT call alterTemplate if templateTransformation is false', done => {
            spyOn(Component, 'alterTemplate').and.callThrough();

            @Component({
                selector: 'my-component-ttf',
                template: '<button (click)="ctrl.onclick()">foo</button>'
            })
            class MyComponent {}

            Component.templateTransformation = false;

            MyComponent.getModule().then(() => {
                expect(Component.alterTemplate).not.toHaveBeenCalled();
                expect(MyComponent.template).toBe('<button (click)="ctrl.onclick()">foo</button>');
                Component.templateTransformation = true;
                done();
            });
        });

        it('should set $inject on the directive\'s controller', done => {
            @Component({
                selector: 'my-component-inj',
                template: '<div></div>'
            })
            @Inject('A', 'B', 'C')
            class MyComponent {}

            MyComponent.getModule().then(module => {
                spyOn(module, 'directive').and.returnValue(module);
                module = finish(module);
                const directive = module.directive.calls.mostRecent().args[1][1]();
                expect(directive.controller.$inject).toEqual([ 'A', 'B', 'C' ]);
                done();
            }).catch(fail);
        });

        it('should register a directive', done => {
            const template = '<div>My component!</div>';

            @Component({
                selector: 'my-component-dir',
                template
            })
            class MyComponentDir {}

            MyComponentDir.getModule().then(module => {
                angular.mock.module('my-component-dir');
                finish(module);
                inject(($compile, $rootScope) => {
                    const scope = $rootScope.$new()
                        , elem  = angular.element(document.createElement('my-component-dir'))
                        , comp  = $compile(elem)(scope);

                    scope.$digest();
                    expect(comp[0].innerHTML).toBe(template);
                    done();
                });
            }).catch(fail);
        });
    });
});
