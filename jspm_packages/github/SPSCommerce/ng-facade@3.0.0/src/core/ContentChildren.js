import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

import ElementRef from './ElementRef';

function ContentChildren(C, opts) {
    return (t, name, descriptor) => {
        const T = t.constructor;

        descriptor.writable = true;

        const viewChildren = ngfMetadata.get(MetadataKey.VIEW_CHILDREN, T, {});

        viewChildren[name] = {
            selector:   `ng-transclude ${C.selector}`,
            all:        true,
            elementRef: Boolean(opts && opts.read === ElementRef),
        };
        ngfMetadata.define(MetadataKey.VIEW_CHILDREN, viewChildren, T);
    };
}

export default ContentChildren;
