/* eslint-env jasmine */
import angular from 'angular';

import NgModule from 'src/core/NgModule';

describe('The NgModule decorator', () => {
    beforeEach(() => {
        spyOn(angular, 'module').and.callFake(() => {
            if (angular.module.calls.count() === 1) {
                throw new Error();
            }

            return {};
        });
    });

    it('should filter bootstrap items out of declarations', done => {
        class ComponentOne {
            static getModule = () => Promise.resolve({})
        }
        class ComponentTwo {
            static getModule = () => Promise.resolve({})
        }

        const moduleDef = {
            declarations: [
                ComponentOne,
                ComponentTwo
            ],
            bootstrap: [ ComponentTwo ]
        };

        @NgModule(moduleDef)
        class MyModule {}

        MyModule.getModule().then(() => {
            expect(moduleDef.declarations).toEqual([ ComponentOne ]);
            done();
        }).catch(fail);
    });

    it('should load modules in the following order: imports, providers, declarations, bootstrap', done => {
        const loaded = [];

        class ImportedModule {
            static getModule() {
                loaded.push(ImportedModule);
                return Promise.resolve({});
            }
        }
        class MyProvider {
            static getModule() {
                loaded.push(MyProvider);
                return Promise.resolve({});
            }
        }
        class ComponentOne {
            static getModule() {
                loaded.push(ComponentOne);
                return Promise.resolve({});
            }
        }
        class ComponentTwo {
            static getModule() {
                loaded.push(ComponentTwo);
                return Promise.resolve({});
            }
        }

        @NgModule({
            imports:      [ ImportedModule ], // eslint-disable-line
            providers:    [ MyProvider ], // eslint-disable-line
            declarations: [ ComponentOne ],
            bootstrap:    [ ComponentTwo ] // eslint-disable-line
        })
        class MyModule {}

        MyModule.getModule().then(() => {
            expect(loaded).toEqual([
                ImportedModule,
                MyProvider,
                ComponentOne,
                ComponentTwo
            ]);
            done();
        }).catch(fail);
    });

    it('should copy the bootstrap list to the module class', done => {
        class MyComponent {}

        @NgModule({
            bootstrap: [ MyComponent ]
        })
        class MyModule {}

        MyModule.getModule().then(() => {
            expect(MyModule.bootstrap).toEqual([ MyComponent ]);
            done();
        }).catch(fail);
    });

    it('should register an angular module', done => {
        @NgModule({})
        class MyModule {}

        MyModule.getModule('A', 'B').then(() => {
            expect(angular.module).toHaveBeenCalledWith('MyModule', [ 'A', 'B' ]);
            done();
        }).catch(fail);
    });
});
