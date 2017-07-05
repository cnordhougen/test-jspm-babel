/* eslint-env jasmine */
import Input       from 'src/core/Input';
import MetadataKey from 'src/util/metadata/MetadataKey';
import ngfMetadata from 'src/util/metadata/ngfMetadata';

describe('The Input decorator', () => {
    it('should add metadata to the component class', () => {
        class MyComponent {
            @Input() myInput;
        }

        expect(ngfMetadata.has(MetadataKey.INPUT, MyComponent)).toBe(true);
    });

    it('should add to existing metadata if it\'s there', () => {
        class MyComponent {
            @Input() myInput;
            @Input() myOtherInput;
        }

        const inputs = ngfMetadata.get(MetadataKey.INPUT, MyComponent);
        expect(inputs.myInput).toBeDefined();
        expect(inputs.myOtherInput).toBeDefined();
    });

    it('should copy the initializer', () => {
        class MyComponent {
            @Input() myInput = 'foo';
        }

        const inputs = ngfMetadata.get(MetadataKey.INPUT, MyComponent);
        expect(inputs.myInput.initializer()).toBe('foo');
    });

    it('should copy the alias if there is one', () => {
        class MyComponent {
            @Input('foo') myInput;
        }

        const inputs = ngfMetadata.get(MetadataKey.INPUT, MyComponent);
        expect(inputs.myInput.alias).toBe('foo');
    });
});
