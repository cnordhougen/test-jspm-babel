/* eslint-env jasmine */
import angular from 'angular';

import platformBrowserDynamic from 'src/platform-browser-dynamic/platformBrowserDynamic';

describe('platformBrowserDynamic / bootstrapModule', () => {
    let module;

    beforeEach(() => {
        module = {
            getModule() {
                return Promise.resolve();
            },

            bootstrap: []
        };
    });

    it('should throw an error if the module has nothing to bootstrap', done => {
        platformBrowserDynamic().bootstrapModule(module).then(fail).catch(err => {
            expect(err.message).toBe('Nothing in module to bootstrap!');
            done();
        });
    });

    it('should call angular.bootstrap', done => {
        spyOn(angular, 'bootstrap');
        module.bootstrap.push({ selector: 'my-component' });

        platformBrowserDynamic().bootstrapModule(module).then(() => {
            expect(angular.bootstrap).toHaveBeenCalledWith(document, [ 'my-component' ]);
            done();
        }).catch(fail);
    });
});
