/* eslint-env jasmine */
import HostListener from 'src/core/HostListener';
import MetadataKey  from 'src/util/metadata/MetadataKey';
import ngfMetadata  from 'src/util/metadata/ngfMetadata';

describe('The @HostListener decorator', () => {
    it('should define metadata on the class', () => {
        class MyComponent {
            @HostListener('click') onClick() {}
            @HostListener('mouseover') onMouseOver() {}
        }

        expect(ngfMetadata.has(MetadataKey.HOST_LISTENER, MyComponent)).toBe(true);
        const hostListeners = ngfMetadata.get(MetadataKey.HOST_LISTENER, MyComponent);
        expect(hostListeners).toEqual([
            { eventName: 'click', listenerName: 'onClick' },
            { eventName: 'mouseover', listenerName: 'onMouseOver' }
        ]);
    });
});
