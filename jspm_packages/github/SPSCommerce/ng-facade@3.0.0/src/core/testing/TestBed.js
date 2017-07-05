import angular from 'angular';
import 'angular-mocks';

class TestBed {
    constructor() {
        this._provided = new Map();
    }

    static configureTestingModule(def) {
        const imports       = def.imports || []
            , declarations  = def.declarations || []
            , providers     = def.providers || []
            , ngfMProviders = providers.filter(p => p.getModule)
            , ngfModules    = [].concat(declarations)
                                .concat(ngfMProviders)
            , $provideList  = providers.filter(p => p.provide)
            , testBed       = new TestBed();

        for (const impt of imports) {
            impt.getModule();
        }

        const load = Promise.all(ngfModules.map(D => D.getModule())).then(() => {
            angular.mock.module(
                ...ngfModules.map(D => D.selector || `${D.name}Module`),
                $provide => {
                    for (const p of $provideList) {
                        const name  = p.provide.name || `${p.provide}`;
                        let value;
                        if (p.hasOwnProperty('useValue')) {
                            value = p.useValue;
                        } else if (p.hasOwnProperty('useClass')) {
                            value = new p.useClass();
                        } else {
                            throw new Error('Invalid provider config, must have useValue or useClass', p);
                        }

                        testBed._provided.set(p.provide, value);
                        $provide.value(name, value);
                    }
                }
            );
            angular.mock.inject(ngfMProviders.map(p => p.name).concat((...vals) => {
                for (const [ i, p ] of ngfMProviders.entries()) {
                    testBed._provided.set(p, vals[i]);
                }
            }));
            TestBed._active = testBed;
        });

        load.compileComponents = () => load;
        return load;
    }

    static createComponent(C) {
        let fixture;
        angular.mock.inject(($compile, $rootScope, $timeout) => {
            const el    = angular.element(document.createElement(C.selector))
                , scope = $rootScope.$new();

            $compile(el)(scope);

            const isoScope = el.isolateScope();

            fixture = {
                isolateScope:      isoScope,
                componentInstance: isoScope.ctrl,
                debugElement:      el,
                nativeElement:     el.nativeElement || el[0],
                detectChanges() {
                    isoScope.$apply();
                    try {
                        $timeout.flush();
                    } catch (ignore) { /*ignore*/ }
                }
            };
        });
        return fixture;
    }

    get(token, notFoundValue) {
        return this._provided.has(token) ? this._provided.get(token) : notFoundValue;
    }
}

export default TestBed;
