import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

const HOST_BINDING_PRIORITY = 1000
    , HOST_BINDING_TYPES    = [ 'attr', 'class' ];

function HostBinding(bindTarget) {
    return (t, name, descriptor) => {
        const T = t.constructor;

        descriptor.writable = true;
        const [ type, target ] = bindTarget.split('.');
        if (!HOST_BINDING_TYPES.includes(type)) {
            throw new Error(`Host binding type "${type}" invalid or not implemented`);
        }

        let hostBindings;
        if (ngfMetadata.has(MetadataKey.HOST_BINDING, T)) {
            hostBindings = ngfMetadata.get(MetadataKey.HOST_BINDING, T);
        } else {
            hostBindings = HOST_BINDING_TYPES.reduce((o, t) => Object.assign(o, { [t]: [] }), {});
        }

        hostBindings[type].push({ name, target });
        ngfMetadata.define(MetadataKey.HOST_BINDING, hostBindings, T);
    };
}
HostBinding.ngfLink = (T, scope, element, attrs, ctrl, transclude, $compile) => {
    if (ngfMetadata.has(MetadataKey.HOST_BINDING, T)) {
        const hostBindings = ngfMetadata.get(MetadataKey.HOST_BINDING, T);

        for (const attrBinding of hostBindings.attr) {
            element.attr(attrBinding.target, `{{ ctrl.${attrBinding.name} }}`);
        }

        if (hostBindings.class.length) {
            const newNgC = hostBindings.class.map(cb => `'${cb.target}': ctrl.${cb.name}`)
                                             .join(', ');

            element.attr('ng-class', '{' + newNgC + '}');
        }

        $compile(element, transclude, HOST_BINDING_PRIORITY)(scope);
    }
};
HostBinding.ngfInit = (T, directive) => {
    if (ngfMetadata.has(MetadataKey.HOST_BINDING, T)) {
        directive.priority = HOST_BINDING_PRIORITY;
        directive.terminal = true;
    }
};

export default HostBinding;
