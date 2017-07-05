import ngfModule   from '../util/module/ngfModule';
import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

function Injectable() {
    return T => {
        let factoryDef;

        ngfModule.init(`${T.name}Module`, T, {
            modulesLoaded() {
                const injects = ngfMetadata.get(MetadataKey.INJECT, T);
                factoryDef = injects.$inject.concat([ ngfModule.instantiator(T) ]);
            },

            finish(angularModule) {
                return angularModule.factory(T.name, factoryDef);
            }
        });
    };
}

export default Injectable;
