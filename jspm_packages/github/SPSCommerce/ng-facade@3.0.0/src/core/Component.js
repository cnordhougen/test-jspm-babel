import angular from 'angular';

import ViewChildren from './ViewChildren';
import ngfDirective from '../util/directive/ngfDirective';
import ngfModule    from '../util/module/ngfModule';
import ngfTemplate  from '../util/directive/ngfTemplate';

function Component(cdef) {
    return T => {
        if (!cdef.selector) {
            // MyFooBarComponent -> my-foo-bar
            cdef.selector = ngfDirective.camelToDash(T.name.replace(/Component$/, ''));
        }
        T.selector = cdef.selector;

        const importBase = cdef.moduleId ? cdef.moduleId.replace(/[^/]*$/, '') : '';

        if (cdef.styles) {
            ngfDirective.loadStyles(cdef);
        } else if (cdef.styleUrls) {
            const imports = cdef.styleUrls.map(url => System.import(`${importBase}${url}!text`));
            T.stylesLoad = Promise.all(imports).then(styles => {
                cdef.styles = styles;
                ngfDirective.loadStyles(cdef);
            });
        }

        ngfModule.init(cdef.selector, T, {
            begin() {
                return [ cdef.providers, cdef.directives ];
            },

            modulesLoaded() {
                return ngfTemplate.get(cdef, importBase).then(template => {
                    T.template = template;
                });
            },

            finish(angularModule) {
                const directiveName = ngfDirective.dashToCamel(cdef.selector)
                    , ddef = {
                        restrict:   'E',
                        transclude: Boolean(T.template.match('ng-transclude')),
                        template:   T.template,
                    }
                    , ancillaryLink = [ ViewChildren, 'AfterViewInit' ];
                
                return ngfDirective.create(T, directiveName, angularModule, ddef, ancillaryLink);
            }
        });
    };
}

export default Component;
