import angular from 'angular';

import ngfDirective from '../util/directive/ngfDirective';
import ngfModule    from '../util/module/ngfModule';

function Directive(cdef) {
    return T => {
        if (!cdef.selector) {
            throw new Error('Selector is required for @Directive');
        } else if (!cdef.selector.match(/^\[/) || !cdef.selector.match(/]$/)) {
            throw new Error('@Directive must have an attribute selector, e.g. [myAttr]');
        }
        const selector = cdef.selector.match(/^\[([^\]]+)\]/)[1].toLowerCase();
        T.selector = ngfDirective.dashToCamel(selector);
                         

        ngfModule.init(`${T.selector}Directive`, T, {
            begin() {
                return [ cdef.providers, cdef.directives ];
            },

            finish(angularModule) {
                return ngfDirective.create(T, T.selector, angularModule, { restrict: 'A' });
            }
        });
    };
}

export default Directive;
