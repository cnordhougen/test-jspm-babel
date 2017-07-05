/* eslint-env jasmine */
import HostBinding from 'src/core/HostBinding';
import MetadataKey from 'src/util/metadata/MetadataKey';
import ngfMetadata from 'src/util/metadata/ngfMetadata';

describe('The @HostBinding decorator', () => {
    it('should define metadata on the class', () => {
        class MyComponent {
            @HostBinding('class.foo') isFoo = true;
            @HostBinding('attr.bar') barValue = 'aaa';
            @HostBinding('attr.baz') bazValue = 'bbb';
        }

        expect(ngfMetadata.has(MetadataKey.HOST_BINDING, MyComponent)).toBe(true);
        const hostBindings = ngfMetadata.get(MetadataKey.HOST_BINDING, MyComponent);
        expect(hostBindings).toEqual({
            class: [ { name: 'isFoo', target: 'foo' } ],
            attr:  [
                { name: 'barValue', target: 'bar' },
                { name: 'bazValue', target: 'baz' }
            ]
        });
    });
});
