import HostBinding  from '../../core/HostBinding';
import HostListener from '../../core/HostListener';
import Input        from '../../core/Input';
import Output       from '../../core/Output';
import MetadataKey  from '../metadata/MetadataKey';
import ngfMetadata  from '../metadata/ngfMetadata';
import ngfModule    from '../module/ngfModule';

import loadStyles    from './loadStyles';

const LINK_ORDER = [
    Input,
    HostBinding,
    HostListener,
    Output,
    'OnInit',
];

const ngfDirective = {
    loadStyles,

    dashToCamel(name) {
        return name.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
    },

    camelToDash(name) {
        return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },

    create(T, name, angularModule, ddef, ancillaryLink = []) {
        const linkOrder    = LINK_ORDER.concat(ancillaryLink)
            , binds        = ngfMetadata.get(MetadataKey.BINDS, T, {})
            , instantiator = ngfModule.instantiator(T);

        return angularModule.directive(name, [ '$compile', $compile => {
            const directive = Object.assign({
                scope:            binds,
                bindToController: true,
                controller:       instantiator,
                controllerAs:     'ctrl',

                link(scope, element, attrs, ctrl, transclude) {
                    for (const l of linkOrder) {
                        if (l.ngfLink) {
                            l.ngfLink(T, scope, element, attrs, ctrl, transclude, $compile);
                        } else if (typeof l === 'string') {
                            if (ctrl[`ng${l}`]) {
                                ctrl[`ng${l}`]();
                            }
                        }
                    }
                }
            }, ddef);

            for (const l of linkOrder) {
                if (l.ngfInit) {
                    l.ngfInit(T, directive);
                }
            }

            return directive;
        } ]);
    },
};

export default ngfDirective;
