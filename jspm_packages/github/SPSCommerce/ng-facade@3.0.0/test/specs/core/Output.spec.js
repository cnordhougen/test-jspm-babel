/* eslint-env jasmine */
import Output      from 'src/core/Output';
import MetadataKey from 'src/util/metadata/MetadataKey';
import ngfMetadata from 'src/util/metadata/ngfMetadata';

describe('The Output decorator', () => {
    it('should define metadata on the component class', () => {
        class MyComponent {
            @Output() myOutput;
        }

        expect(ngfMetadata.has(MetadataKey.OUTPUT, MyComponent)).toBe(true);
    });

    it('should add to existing metadata if it\'s there', () => {
        class MyComponent {
            @Output() myOutput;
            @Output() myOtherOutput;
        }

        const outputs = ngfMetadata.get(MetadataKey.OUTPUT, MyComponent);
        expect(outputs).toContain('myOutput');
        expect(outputs).toContain('myOtherOutput');
    });
});
