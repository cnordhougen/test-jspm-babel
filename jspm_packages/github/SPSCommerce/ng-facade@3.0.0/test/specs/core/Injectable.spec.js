/* eslint-env jasmine */
import angular from 'angular';

import Inject      from 'src/core/Inject';
import Injectable  from 'src/core/Injectable';
import MetadataKey from 'src/util/metadata/MetadataKey';
import ngfMetadata from 'src/util/metadata/ngfMetadata';

describe('The Injectable decorator', () => {
    it('should trigger getModule when referenced in @Inject', done => {
        class MyDepA {
            static getModule() {
                return Promise.resolve({});
            }
        }
        spyOn(MyDepA, 'getModule').and.callThrough();

        class MyDepB {
            static getModule() {
                return Promise.resolve({});
            }
        }
        spyOn(MyDepB, 'getModule').and.callThrough();

        @Injectable()
        @Inject([ 'MyDepA', MyDepA ], { myDepB: MyDepB })
        class MyService {}

        MyService.getModule().then(() => {
            expect(MyDepA.getModule).toHaveBeenCalled();
            expect(MyDepB.getModule).toHaveBeenCalled();
            done();
        }).catch(fail);
    });

    it('should register an angular module + service', done => {
        const module = { factory() {} };
        spyOn(module, 'factory');

        spyOn(angular, 'module').and.callFake(() => {
            if (angular.module.calls.count() === 1) {
                throw new Error();
            }

            return module;
        });

        @Injectable()
        class MyService {}

        MyService.getModule('A', 'B').then(() => {
            expect(angular.module).toHaveBeenCalledWith('MyServiceModule', [ 'A', 'B' ]);
            expect(module.factory).toHaveBeenCalled();

            const factoryArgs = module.factory.calls.mostRecent().args;
            expect(factoryArgs[0]).toBe('MyService');
            const inject = ngfMetadata.get(MetadataKey.INJECT, MyService);
            expect(factoryArgs[1].slice(0, factoryArgs[1].length - 1)).toEqual(inject.$inject);
            expect(typeof factoryArgs[1][factoryArgs[1].length - 1]).toBe('function');

            done();
        }).catch(fail);
    });
});
