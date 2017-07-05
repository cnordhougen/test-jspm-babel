/* eslint-env jasmine */
import Injectable     from 'src/core/Injectable';
import A1InjectToken  from 'src/util/injection/A1InjectToken';
import InjectionSetup from 'src/util/injection/InjectionSetup';

describe('InjectionSetup()', () => {
    it('for a string arg should add string as argument name and thing to inject', () => {
        const iSetup = new InjectionSetup([ 'foo' ]);
        expect(iSetup.variableNames).toEqual([ 'foo' ]);
        expect(iSetup.$inject).toEqual([ 'foo' ]);
        expect(iSetup.ngfModules).toEqual([]);
    });

    it('for an A1InjectToken arg should add its key as argument name and thing to inject', () => {
        const Foo    = new A1InjectToken('foo')
            , iSetup = new InjectionSetup([ Foo ]);

        expect(iSetup.variableNames).toEqual([ 'foo' ]);
        expect(iSetup.$inject).toEqual([ 'foo' ]);
        expect(iSetup.ngfModules).toEqual([]);
    });

    it('for an ng-facade decorated class with .getModule() should add its name & add to depsToLoad', () => {
        @Injectable()
        class FooService {}

        const iSetup = new InjectionSetup([ FooService ]);
        expect(iSetup.variableNames).toEqual([ 'FooService' ]);
        expect(iSetup.$inject).toEqual([ 'FooService' ]);
        expect(iSetup.ngfModules).toEqual([ FooService ]);
    });

    describe('for an Object argument', () => {
        it('should add key as argument name, value name as thing to inject, add to depsToLoad when value has .getModule()', () => {
            @Injectable()
            class FooService {}

            const iSetup = new InjectionSetup([ { fs: FooService } ]);
            expect(iSetup.variableNames).toEqual([ 'fs' ]);
            expect(iSetup.$inject).toEqual([ 'FooService' ]);
            expect(iSetup.ngfModules).toEqual([ FooService ]);
        });

        it('should add key as argument name & A1InjectToken key as thing to inject when value is A1InjectToken', () => {
            const Foo    = new A1InjectToken('foo')
                , iSetup = new InjectionSetup([ { f: Foo } ]);

            expect(iSetup.variableNames).toEqual([ 'f' ]);
            expect(iSetup.$inject).toEqual([ 'foo' ]);
            expect(iSetup.ngfModules).toEqual([]);
        });

        it('should add key as argument name & value as thing to inject when value is string', () => {
            const iSetup = new InjectionSetup([ { f: 'foo' } ]);
            expect(iSetup.variableNames).toEqual([ 'f' ]);
            expect(iSetup.$inject).toEqual([ 'foo' ]);
            expect(iSetup.ngfModules).toEqual([]);
        });

        it('should throw if value is neither .getModule\'d, a Symbol, nor a string', () => {
            expect(() => new InjectionSetup([ { f: 2 } ])).toThrow();
        });
    });

    it('for an array should add element 0 as argument name and element 1 as thing to inject', () => {
        const iSetup = new InjectionSetup([ [ 'foo', 'FooService' ] ]);
        expect(iSetup.variableNames).toEqual([ 'foo' ]);
        expect(iSetup.$inject).toEqual([ 'FooService' ]);
        expect(iSetup.ngfModules).toEqual([]);
    });

    it('should throw if arg is neither a string, a Synbol, .getModule\'d, an Object, nor an array', () => {
        expect(() => new InjectionSetup([ -1 ])).toThrow();
    });


    describe('concat()', () => {
        it('should throw if the argument is not an InjectionSetup', () => {
            const iSetup = new InjectionSetup();
            expect(() => iSetup.concat('1234')).toThrow();
        });

        it('should combine the two InjectionSetups', () => {
            @Injectable()
            class FooService {}

            class FooXform {
                static inject = 'foo';
            }

            @Injectable()
            class BarService {}

            class BarXform {
                static inject = 'bar';
            }

            const iSetupA = new InjectionSetup([ { foo: FooService, xfoo: FooXform } ])
                , iSetupB = new InjectionSetup([ { bar: BarService, xbar: BarXform } ]);

            iSetupA.concat(iSetupB);

            expect(iSetupA.variableNames).toEqual([ 'foo', 'xfoo', 'bar', 'xbar' ]);
            expect(iSetupA.$inject).toEqual([ 'FooService', 'foo', 'BarService', 'bar' ]);
            expect(iSetupA.ngfModules).toEqual([ FooService, BarService ]);
            expect(iSetupA.classes).toEqual({
                xfoo: FooXform,
                xbar: BarXform,
            });
        });
    });
});
