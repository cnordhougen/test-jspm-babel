import angular from 'angular';

import InjectionSetup from '../injection/InjectionSetup';
import MetadataKey    from '../metadata/MetadataKey';
import ngfMetadata    from '../metadata/ngfMetadata';
import instantiator   from './instantiator';
import loadModules    from './loadModules';

const ngfModule = {
    init(name, T, funcs) {
        if (!funcs) {
            funcs = T || {};
            T = name;
            name = T.name;
        }

        let moduleLoad, injects;

        if (ngfMetadata.has(MetadataKey.INJECT, T)) {
            injects = ngfMetadata.get(MetadataKey.INJECT, T);
        } else {
            injects = new InjectionSetup();
            ngfMetadata.define(MetadataKey.INJECT, injects, T);
        }

        T.getModule = function (...addlMods) {
            if (moduleLoad) {
                return moduleLoad;
            }

            try {
                return Promise.resolve(angular.module(name));
            } catch (e) {
                let begin = funcs.begin ? funcs.begin() : [];
                if (!begin || !begin.then) {
                    begin = Promise.resolve(begin);
                }

                moduleLoad = begin.then((modulesToLoad = []) =>
                    ngfModule.loadModules(...modulesToLoad.concat(injects.ngfModules)).then((mods = []) => {
                        let modulesLoaded = funcs.modulesLoaded ? (funcs.modulesLoaded(mods) || []) : [];
                        if (!modulesLoaded.then) {
                            modulesLoaded = Promise.resolve(modulesLoaded);
                        }

                        return modulesLoaded.then((addlDeps = []) => {
                            const angularDeps = [].concat(addlDeps)
                                                  .concat(mods)
                                                  .concat(addlMods)
                                , angularModule = angular.module(name, angularDeps);

                            moduleLoad = false;

                            return funcs.finish ? funcs.finish(angularModule) : angularModule;
                        });
                    })
                );

                return moduleLoad;
            }
        };
    }
};

Object.assign(ngfModule, {
    instantiator,
    loadModules
});

export default ngfModule;
