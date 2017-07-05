import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

function HostListener(eventName) {
    return (t, listenerName) => {
        const T = t.constructor;

        const hostListeners = ngfMetadata.get(MetadataKey.HOST_LISTENER, T, []);
        hostListeners.push({ eventName, listenerName });
        ngfMetadata.define(MetadataKey.HOST_LISTENER, hostListeners, T);
    };
}
HostListener.ngfLink = (T, scope, element, attrs, ctrl) => {
    if (ngfMetadata.has(MetadataKey.HOST_LISTENER, T)) {
        const hostListeners = ngfMetadata.get(MetadataKey.HOST_LISTENER, T);
        for (const hl of hostListeners) {
            element.on(hl.eventName, ctrl[hl.listenerName].bind(ctrl));
        }
    }
};

export default HostListener;
