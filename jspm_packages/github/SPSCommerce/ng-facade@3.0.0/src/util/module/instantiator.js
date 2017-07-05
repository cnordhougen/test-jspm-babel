import MetadataKey from '../metadata/MetadataKey';
import ngfMetadata from '../metadata/ngfMetadata';

function instantiator(T) {
    const injects = ngfMetadata.get(MetadataKey.INJECT, T);

    let C = Object.getPrototypeOf(T);
    while (ngfMetadata.has(MetadataKey.INJECT, C)) {
        injects.concat(ngfMetadata.get(MetadataKey.INJECT, C));
        C = Object.getPrototypeOf(C);
    }

    function inst(...args) {
        for (const [ i, name ] of injects.variableNames.entries()) {
            const IC = injects.classes[name];
            if (IC) {
                args[i] = new IC(args[i]);
            }
        }
        const instance = new T(...args);
        for (const [ i, name ] of injects.variableNames.entries()) {
            instance[name] = args[i];
        }

        const inputs = ngfMetadata.get(MetadataKey.INPUT, T, {});
        for (const k of Object.keys(inputs)) {
            inputs[k].default = instance[k];
        }
        ngfMetadata.define(MetadataKey.INPUT, inputs, T);

        return instance;
    }
    inst.$inject = injects.$inject;

    return inst;
}

export default instantiator;
