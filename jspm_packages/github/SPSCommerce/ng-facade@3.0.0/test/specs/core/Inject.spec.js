/* eslint-env jasmine */
import Inject         from 'src/core/Inject';
import InjectionSetup from 'src/util/injection/InjectionSetup';
import MetadataKey    from 'src/util/metadata/MetadataKey';
import ngfMetadata    from 'src/util/metadata/ngfMetadata';

describe('The @Inject decorator', () => {
    it('should create metadata on the class of type InjectionSetup', () => {
        @Inject('Foo')
        class MyClass {}

        expect(ngfMetadata.has(MetadataKey.INJECT, MyClass)).toBe(true);
        const inject = ngfMetadata.get(MetadataKey.INJECT, MyClass);
        expect(inject instanceof InjectionSetup).toBe(true);
    });
});
