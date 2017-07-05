import ngfModule from '../util/module/ngfModule';

function NgModule(mdef) {
    return T => {
        ngfModule.init(T, {
            begin() {
                mdef.bootstrap = mdef.bootstrap || [];
                mdef.declarations = (mdef.declarations || []).filter(d => !mdef.bootstrap.includes(d));

                return [
                    mdef.imports,
                    mdef.providers,
                    mdef.declarations,
                    mdef.bootstrap
                ];
            },

            modulesLoaded() {
                T.bootstrap = mdef.bootstrap;
            }
        });
    };
}

export default NgModule;
