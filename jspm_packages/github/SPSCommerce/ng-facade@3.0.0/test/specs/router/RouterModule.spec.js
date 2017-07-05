/* eslint-env jasmine */
import angular from 'angular';

import ngfTemplate  from 'src/util/directive/ngfTemplate';
import RouterModule from 'src/router/RouterModule';

describe('RouterModule', () => {
    describe('addRoutes', () => {
        it('should add a leading slash to the paths at the root level', () => {
            const result = RouterModule.addRoutes([
                {
                    path: 'foo'
                }, {
                    path: 'bar'
                }
            ]);

            expect(result[0].url).toEqual('/foo/');
            expect(result[1].url).toEqual('/bar/');
        });

        it('should keep route.name if it\'s present', () => {
            const result = RouterModule.addRoutes([
                {
                    name: 'myfooroute',
                    path: 'foo'
                }
            ]);

            expect(result[0].name).toBe('myfooroute');
        });

        it('should set the name from the path if name is not present', () => {
            const result = RouterModule.addRoutes([
                {
                    path: 'foo'
                }, {
                    path: 'bar/baz'
                }
            ]);

            expect(result[0].name).toBe('foo');
            expect(result[1].name).toBe('bar.baz');
        });

        it('should change A2 path params to A1 style', () => {
            const result = RouterModule.addRoutes([
                {
                    path: 'foo/:id/bar'
                }
            ]);

            expect(result[0].url).toBe('/foo/{id}/bar/');
        });

        it('should use root / if path is the empty string', () => {
            const result = RouterModule.addRoutes([
                {
                    name: 'foo',
                    path: ''
                }
            ]);

            expect(result[0].url).toBe('/');
        }); // what if path empty (should trim too?) and no name?

        it('should set abstract + ui-view template if redirectTo is set', () => {
            const result = RouterModule.addRoutes([
                {
                    path:       'foo',
                    redirectTo: 'bar'
                }
            ]);

            expect(result[0]).toEqual({
                name:       'foo',
                url:        '/foo/',
                redirectTo: 'bar',
                abstract:   true,
                template:   '<ui-view/>'
            });
        });

        it('should set template to component\'s selector & remove component prop', () => {
            const result = RouterModule.addRoutes([
                {
                    path:      'foo',
                    component: {
                        selector: 'my-component'
                    }
                }
            ]);

            expect(result[0]).toEqual({
                name:     'foo',
                url:      '/foo/',
                template: '<my-component></my-component>'
            });
        });

        it('should add component-defined query string params to url', () => {
            const result = RouterModule.addRoutes([
                {
                    path: 'foo', // eslint-disable-line
                    component: {
                        selector: 'my-component', // eslint-disable-line
                        queryStringParams: [
                            'paramA',
                            'paramB'
                        ]
                    }
                }
            ]);

            expect(result[0].url).toBe('/foo/?paramA&paramB');
        });

        describe('when there are children', () => {
            it('should recursively call addRoutes on them', () => {
                spyOn(RouterModule, 'addRoutes').and.callThrough();

                const children = [];

                RouterModule.addRoutes([
                    {
                        path: 'foo',
                        children
                    }
                ]);

                expect(RouterModule.addRoutes.calls.mostRecent().args[0]).toBe(children);
            });

            it('should remove the children property afterwards', () => {
                const route = {
                    path:     'foo',
                    children: []
                };

                RouterModule.addRoutes([ route ]);

                expect(route.children).toBeUndefined();
            });

            it('should use children\'s names if present', () => {
                const result = RouterModule.addRoutes([
                    {
                        path: 'foo', // eslint-disable-line
                        children: [
                            {
                                path: 'bar',
                                name: 'baz'
                            }
                        ]
                    }
                ]);

                expect(result).toEqual([
                    {
                        name: 'foo.baz',
                        url:  'bar/'
                    }, {
                        name: 'foo',
                        url:  '/foo/'
                    }
                ]);
            });

            it('should use paths to set names if names are unspecified', () => {
                const result = RouterModule.addRoutes([
                    {
                        path: 'foo', // eslint-disable-line
                        children: [
                            {
                                path: 'bar'
                            }
                        ]
                    }
                ]);

                expect(result).toEqual([
                    {
                        name: 'foo.bar',
                        url:  'bar/'
                    }, {
                        name: 'foo',
                        url:  '/foo/'
                    }
                ]);
            });
        });
    });

    describe('forChild', () => {
        it('should defer to forRoot b/c there is no actual difference here', () => {
            spyOn(RouterModule, 'forRoot');
            const routes = [];
            RouterModule.forChild(routes);
            expect(RouterModule.forRoot).toHaveBeenCalledWith(routes);
        });
    });

    describe('forRoot', () => {
        it('should call addRoutes on the routes', () => {
            spyOn(RouterModule, 'addRoutes');
            const routes = [];
            RouterModule.forRoot(routes);
            expect(RouterModule.addRoutes).toHaveBeenCalledWith(routes);
        });

        describe('getModule', () => {
            it(jasmine.mld`
                should register an angular module with next available name
                and ui.router as its dependency
            `, done => {
                spyOn(angular, 'module').and.returnValue({ config() {} });
                RouterModule.forRoot([]).getModule().then(() => {
                    expect(angular.module).toHaveBeenCalledWith('routingConfig1', [ 'ui.router' ]);
                    done();
                }).catch(fail);
            });

            it('should add a config block to the module from routeConfig', done => {
                const module = { config() {} };

                spyOn(module, 'config');
                spyOn(angular, 'module').and.returnValue(module);
                spyOn(RouterModule, 'routeConfig');

                const routes     = [ { path: 'foo' } ]
                    , expRteList = [
                        {
                            name: 'foo',
                            url:  '/foo/'
                        }
                    ];

                RouterModule.forRoot(routes).getModule().then(() => {
                    expect(module.config).toHaveBeenCalled();
                    expect(RouterModule.routeConfig).toHaveBeenCalledWith(expRteList);
                    done();
                }).catch(fail);
            });

            it('should reject if anything goes wrong with module registration', done => {
                const err = new Error();
                spyOn(angular, 'module').and.throwError(err);
                RouterModule.forRoot([]).getModule().then(fail).catch(error => {
                    expect(error).toBe(err);
                    done();
                });
            });

            describe('should add template replacements', () => {
                beforeAll(() => RouterModule.forRoot([]).getModule());

                it('should replace a basic routerLink with ui-sref', () => {
                    const template = `
                            <a href="#" routerLink="/foo/bar">Foobar</a>
                        `
                        , expected = `
                            <a href="#" ui-sref="foo.bar">Foobar</a>
                        `;

                    expect(ngfTemplate.transform(template)).toBe(expected);
                });

                it('should replace a more complex routerLink with ui-sref', () => {
                    const template = `
                            <a href="#" routerLink="[ 'foo', ctrl.foo_id, 'bar' ]">Foobar</a>
                        `
                        , expected = `
                            <a href="#" ui-sref="foo.id.bar({ id: ctrl.foo_id })">Foobar</a>
                        `;

                    expect(ngfTemplate.transform(template)).toBe(expected);
                });

                it('should replace router-outlet with ui-view', () => {
                    const template = `
                            <div><router-outlet></router-outlet></div>
                        `
                        , expected = `
                            <div><ui-view></ui-view></div>
                        `;

                    expect(ngfTemplate.transform(template)).toBe(expected);
                });
            });
        });
    });

    describe('routeConfig', () => {
        it('should return a function', () => {
            expect(typeof RouterModule.routeConfig([])).toBe('function');
        });

        describe('the function it returns', () => {
            const mockSP = { state() {} }
                , mockURP = { when() {} };

            it('should ignore routes w/o a name or redirectTo', () => {
                spyOn(mockSP, 'state');
                spyOn(mockURP, 'when');

                RouterModule.routeConfig([ {} ])(mockSP, mockURP);

                expect(mockSP.state).not.toHaveBeenCalled();
                expect(mockURP.when).not.toHaveBeenCalled();
            });

            it('should register routes that have a name', () => {
                const route = { name: 'foo' };
                spyOn(mockSP, 'state');

                RouterModule.routeConfig([ route ])(mockSP, mockURP);

                expect(mockSP.state).toHaveBeenCalledWith(route);
            });

            it('should register redirect when redirectTo is present', () => {
                const route = {
                    url:        '/foo/',
                    redirectTo: '/bar'
                };
                spyOn(mockURP, 'when');

                RouterModule.routeConfig([ route ])(mockSP, mockURP);

                const whenArgs = mockURP.when.calls.mostRecent().args;
                expect(whenArgs[0]).toBe('/foo/');
                expect(typeof whenArgs[1]).toBe('function');

                const mockState = { go() {} };
                spyOn(mockState, 'go');

                whenArgs[1](mockState);
                expect(mockState.go).toHaveBeenCalledWith('bar');
            });
        });
    });
});
