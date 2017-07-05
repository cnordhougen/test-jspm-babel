import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

function Output() {
    return (t, name) => {
        const T = t.constructor;

        const outputs = ngfMetadata.get(MetadataKey.OUTPUT, T, []);
        outputs.push(name);
        ngfMetadata.define(MetadataKey.OUTPUT, outputs, T);

        const binds = ngfMetadata.get(MetadataKey.BINDS, T, {});
        binds[`${name}Handler`] = `&${name.toLowerCase()}`;
        ngfMetadata.define(MetadataKey.BINDS, binds, T);
    };
}
Output.ngfLink = (T, scope, element, attrs, ctrl) => {
    if (ngfMetadata.has(MetadataKey.OUTPUT, T)) {
        const outputs = ngfMetadata.get(MetadataKey.OUTPUT, T);

        for (const name of outputs) {
            const ee      = ctrl[name]
                , emit    = ee.emit.bind(ee)
                , handler = ctrl[`${name}Handler`];
            ee.emit = $event => emit(name, $event);
            ee.on(name, $event => handler({ $event }));
        }
    }
};

export default Output;
