/* eslint-env jasmine */
import Component   from 'src/core/Component';
import ViewChild   from 'src/core/ViewChild';
import MetadataKey from 'src/util/metadata/MetadataKey';
import ngfMetadata from 'src/util/metadata/ngfMetadata';

describe('The @ViewChild decorator', () => {
    @Component({ template: '<b>foo</b>' })
    class TestChildOneComponent {}
    @Component({ template: '<b>bar</b>' })
    class TestChildTwoComponent {}

    it('should define metadata on host component class', () => {
        @Component({
            template: `
                <div>
                    <test-child-one></test-child-one>
                    <test-child-two></test-child-two>
                </div>
            `
        })
        class MyComponent {
            @ViewChild(TestChildOneComponent) one;
            @ViewChild(TestChildTwoComponent) two;
        }

        expect(ngfMetadata.has(MetadataKey.VIEW_CHILDREN, MyComponent)).toBe(true);
        expect(ngfMetadata.get(MetadataKey.VIEW_CHILDREN, MyComponent)).toEqual({
            one: { selector: 'test-child-one', elementRef: false },
            two: { selector: 'test-child-two', elementRef: false },
        });
    });
});
