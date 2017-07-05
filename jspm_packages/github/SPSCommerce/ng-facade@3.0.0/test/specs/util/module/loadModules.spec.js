/* eslint-env jasmine */
import loadModules from 'src/util/module/loadModules';

describe('loadModules', () => {
    it('should resolve with an empty array if no args are passed', done => {
        loadModules().then(result => {
            expect(result).toEqual([]);
            done();
        }).catch(fail);
    });

    it('should filter out falsy elements in each module list', done => {
        loadModules([ 'ABC', undefined, 'DEF' ]).then(result => { // eslint-disable-line
            expect(result).toEqual([ 'ABC', 'DEF' ]);
            done();
        }).catch(fail);
    });

    it('should .getModule elements that have it & pass along others', done => {
        const m1 = { getModule: () => Promise.resolve('ABC') }
            , m2 = { getModule: () => Promise.resolve('DEF') };
        loadModules([ m1, m2, 'GHI' ]).then(result => {
            expect(result).toEqual([ 'ABC', 'DEF', 'GHI' ]);
            done();
        }).catch(fail);
    });

    it('should replace non-getModule element with .name if present', done => {
        loadModules([ { name: 'ABC' } ]).then(result => {
            expect(result).toEqual([ 'ABC' ]);
            done();
        }).catch(fail);
    });

    it('should load lists in order, one after the other', done => {
        const m1 = {
                getModule() {
                    this.loaded = true;
                    return Promise.resolve({});
                }
            }
            , m2 = {
                getModule() {
                    this.loaded = true;
                    expect(m1.loaded).toBe(true);
                    return Promise.resolve({});
                }
            }
            , m3 = {
                getModule() {
                    this.loaded = true;
                    expect(m2.loaded).toBe(true);
                    return Promise.resolve({});
                }
            };

        loadModules([ m1 ], [ m2 ], [ m3 ]).then(() => {
            expect(m3.loaded).toBe(true);
            done();
        }).catch(fail);
    });
});
