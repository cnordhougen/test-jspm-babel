import InjectionSetup from '../util/injection/InjectionSetup';
import MetadataKey    from '../util/metadata/MetadataKey';
import ngfMetadata    from '../util/metadata/ngfMetadata';

function Inject(...args) {
    return T => {
        ngfMetadata.define(MetadataKey.INJECT, new InjectionSetup(args), T);
        return T;
    };
}

export default Inject;
