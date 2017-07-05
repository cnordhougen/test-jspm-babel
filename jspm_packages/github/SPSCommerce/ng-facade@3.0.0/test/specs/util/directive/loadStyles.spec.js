/* eslint-env jasmine */
import loadStyles from 'src/util/directive/loadStyles';

describe('loadStyles', () => {
    it('should replace ":host" selectors, preserving leading whitespace', () => {
        const styles = loadStyles({
            selector: 'my-component',
            styles:   [
                ':host .my-class { font-size: 18px; }',
                '    :host .my-class.foo { font-weight: bold; }'
            ]
        });

        expect(styles).toBe([
            'my-component .my-class { font-size: 18px; }',
            '    my-component .my-class.foo { font-weight: bold; }'
        ].join('\n'));
    });

    it('should replace ":host-context()" selectors, preserving leading whitespace', () => {
        const styles = loadStyles({
            selector: 'my-component',
            styles:   [
                ':host-context(.my-class) { font-size: 18px; }',
                '    :host-context(.my-class.foo) { font-weight: bold; }'
            ]
        });

        expect(styles).toBe([
            '.my-class my-component { font-size: 18px; }',
            '    .my-class.foo my-component { font-weight: bold; }'
        ].join('\n'));
    });

    it('should replace ":host()" selectors, preserving leading whitespace', () => {
        const styles = loadStyles({
            selector: 'my-component',
            styles:   [
                ':host(.my-class) { font-size: 18px; }',
                '    :host(.my-class.foo) { font-weight: bold; }'
            ]
        });

        expect(styles).toBe([
            'my-component.my-class { font-size: 18px; }',
            '    my-component.my-class.foo { font-weight: bold; }'
        ].join('\n'));
    });
});
