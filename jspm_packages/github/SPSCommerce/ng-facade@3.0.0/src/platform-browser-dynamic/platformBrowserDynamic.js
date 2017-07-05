import angular from 'angular';

function platformBrowserDynamic() {
    return {
        bootstrapModule(module) {
            return module.getModule().then(() => {
                if (module.bootstrap.length === 0) {
                    throw new Error('Nothing in module to bootstrap!');
                } else {
                    angular.bootstrap(document, module.bootstrap.map(comp => comp.selector));
                }
            });
        }
    };
}

export default platformBrowserDynamic;
