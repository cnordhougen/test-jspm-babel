/* eslint-env jasmine */
import angular   from 'angular';

import ngfModule from 'src/util/module/ngfModule';

describe('ngfModule.init', () => {
    it('should add the getModule function to the class', () => {
        class MyClass {}

        ngfModule.init(MyClass);

        expect(MyClass.getModule).toBeDefined();
    });

    describe('getModule', () => {
        it('should resolve with the existing module if there is one', done => {
            const module = {};
            spyOn(angular, 'module').and.returnValue(module);

            class MyClass {}

            ngfModule.init(MyClass);

            MyClass.getModule().then(mod => {
                expect(mod).toBe(module);
                done();
            }).catch(fail);
        });

        it('should return the outstanding loadModules promise if there is one', done => {
            let rejectLM;
            spyOn(ngfModule, 'loadModules').and.returnValue(new Promise((resolve, reject) => (rejectLM = reject)));

            class MyClass {}

            ngfModule.init(MyClass);

            expect(MyClass.getModule()).toBe(MyClass.getModule());

            MyClass.getModule().then(fail).catch(done);
            rejectLM();
        });

        it('should call loadModules with the return value of funcs.begin', done => {
            let rejectLM;
            const p = new Promise((resolve, reject) => (rejectLM = reject));
            spyOn(ngfModule, 'loadModules').and.returnValue(p);

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return [ 'A', 'B' ];
                }
            });

            MyClass.getModule().then(fail).catch(() => {
                expect(ngfModule.loadModules).toHaveBeenCalledWith('A', 'B');
                done();
            });

            rejectLM();
        });

        it('should support funcs.begin returning a Promise', done => {
            let rejectLM;
            const p = new Promise((resolve, reject) => (rejectLM = reject));
            spyOn(ngfModule, 'loadModules').and.returnValue(p);

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return Promise.resolve([ 'A', 'B' ]);
                }
            });

            MyClass.getModule().then(fail).catch(() => {
                expect(ngfModule.loadModules).toHaveBeenCalledWith('A', 'B');
                done();
            });

            rejectLM();
        });

        it('should support funcs.begin not returning a value at all', done => {
            let rejectLM;
            const p = new Promise((resolve, reject) => (rejectLM = reject));
            spyOn(ngfModule, 'loadModules').and.returnValue(p);

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {}
            });

            MyClass.getModule().then(fail).catch(() => {
                expect(ngfModule.loadModules).toHaveBeenCalledWith();
                done();
            });

            rejectLM();
        });

        it('should call funcs.modulesLoaded with the result of loadModules', done => {
            const funcs = {
                modulesLoaded() {}
            };
            spyOn(funcs, 'modulesLoaded').and.returnValue(Promise.reject());

            let resolveLM;
            const p = new Promise(resolve => (resolveLM = () => resolve([ 'A', 'B' ])));
            spyOn(ngfModule, 'loadModules').and.returnValue(p);

            class MyClass {}

            ngfModule.init(MyClass, funcs);

            MyClass.getModule().then(fail).catch(() => {
                expect(funcs.modulesLoaded).toHaveBeenCalledWith([ 'A', 'B' ]);
                done();
            });

            resolveLM();
        });

        it('should call angular.module with the class name & deps incl funcs.modulesLoaded return value', done => {
            spyOn(ngfModule, 'loadModules').and.callFake((...args) => {
                spyOn(angular, 'module');
                return Promise.resolve(args);
            });

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return [ 'C', 'D' ];
                },

                modulesLoaded() {
                    return [ 'A', 'B' ];
                }
            });

            MyClass.getModule('E', 'F').then(() => {
                expect(angular.module).toHaveBeenCalledWith('MyClass', [ 'A', 'B', 'C', 'D', 'E', 'F' ]);
                done();
            }).catch(fail);
        });

        it('should support funcs.modulesLoaded returning a Promise', done => {
            spyOn(ngfModule, 'loadModules').and.callFake((...args) => {
                spyOn(angular, 'module');
                return Promise.resolve(args);
            });

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return [ 'C', 'D' ];
                },

                modulesLoaded() {
                    return Promise.resolve([ 'A', 'B' ]);
                }
            });

            MyClass.getModule('E', 'F').then(() => {
                expect(angular.module).toHaveBeenCalledWith('MyClass', [ 'A', 'B', 'C', 'D', 'E', 'F' ]);
                done();
            }).catch(fail);
        });

        it('should support funcs.modulesLoaded not returning a value at all', done => {
            spyOn(ngfModule, 'loadModules').and.callFake((...args) => {
                spyOn(angular, 'module');
                return Promise.resolve(args);
            });

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return [ 'A', 'B' ];
                },

                modulesLoaded() {}
            });

            MyClass.getModule('C', 'D').then(() => {
                expect(angular.module).toHaveBeenCalledWith('MyClass', [ 'A', 'B', 'C', 'D' ]);
                done();
            }).catch(fail);
        });

        it('should support not having a funcs.modulesLoaded', done => {
            spyOn(ngfModule, 'loadModules').and.callFake((...args) => {
                spyOn(angular, 'module');
                return Promise.resolve(args);
            });

            class MyClass {}

            ngfModule.init(MyClass, {
                begin() {
                    return [ 'A', 'B' ];
                }
            });

            MyClass.getModule('C', 'D').then(() => {
                expect(angular.module).toHaveBeenCalledWith('MyClass', [ 'A', 'B', 'C', 'D' ]);
                done();
            }).catch(fail);
        });

        it('should use specified module name if provided', done => {
            spyOn(ngfModule, 'loadModules').and.callFake((...args) => {
                spyOn(angular, 'module');
                return Promise.resolve(args);
            });

            class MyClass {}

            ngfModule.init('my-module-name', MyClass, {
                begin() {
                    return [ 'C', 'D' ];
                },

                modulesLoaded() {
                    return [ 'A', 'B' ];
                }
            });

            MyClass.getModule('E', 'F').then(() => {
                expect(angular.module).toHaveBeenCalledWith('my-module-name', [ 'A', 'B', 'C', 'D', 'E', 'F' ]);
                done();
            }).catch(fail);
        });

        it('should call funcs.finish with the angular module if funcs.finish is provided', done => {
            const module = {}
                , funcs = {
                    finish() {}
                };

            spyOn(ngfModule, 'loadModules').and.callFake(() => {
                spyOn(angular, 'module').and.returnValue(module);
                return Promise.resolve();
            });
            spyOn(funcs, 'finish');

            class MyClass {}

            ngfModule.init(MyClass, funcs);

            MyClass.getModule().then(() => {
                expect(funcs.finish).toHaveBeenCalledWith(module);
                done();
            }).catch(fail);
        });
    });
});
