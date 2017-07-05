import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

import ElementRef from './ElementRef';

function initViewChild(el, elementRef) {
    const angularEl = angular.element(el);
    if (elementRef) {
        return new ElementRef(angularEl);
    }
    const isoScope = angularEl.isolateScope();
    if (isoScope) {
        return isoScope.ctrl;
    }
}

function ViewChildren(C, opts) {
    return (t, name, descriptor) => {
        const T = t.constructor;

        descriptor.writable = true;

        const viewChildren = ngfMetadata.get(MetadataKey.VIEW_CHILDREN, T, {});

        viewChildren[name] = {
            selector:   C.selector,
            all:        true,
            elementRef: Boolean(opts && opts.read === ElementRef),
        };
        ngfMetadata.define(MetadataKey.VIEW_CHILDREN, viewChildren, T);
    };
}
ViewChildren.ngfLink = (T, scope, element, attrs, ctrl) => {
    if (ngfMetadata.has(MetadataKey.VIEW_CHILDREN, T)) {
        const viewChildren  = ngfMetadata.get(MetadataKey.VIEW_CHILDREN, T)
            , el            = new ElementRef(element)
            , hasTransclude = T.template.match('ng-transclude');

        for (const name of Object.keys(viewChildren)) {
            const config    = viewChildren[name]
                , isContent = config.selector.match(/^ng-transclude/);

            let result;

            if (config.all) {
                result = Array.from(el.nativeElement.querySelectorAll(config.selector));

                if (!isContent && hasTransclude) {
                    const contentResult = Array.from(
                        el.nativeElement.querySelectorAll(`ng-transclude ${config.selector}`)
                    );
                    result = result.filter(r => !contentResult.includes(r));
                }

                result = result.map(el => initViewChild(el, config.elementRef));
            } else {
                const queryResult   = el.nativeElement.querySelector(config.selector)
                    , contentResult = el.nativeElement.querySelector(`ng-transclude ${config.selector}`);
                
                if (!isContent && (!hasTransclude || (hasTransclude && queryResult !== contentResult))) {
                    result = initViewChild(queryResult, config.elementRef);
                }
            }

            ctrl[name] = result;
        }
    }
};

export default ViewChildren;
