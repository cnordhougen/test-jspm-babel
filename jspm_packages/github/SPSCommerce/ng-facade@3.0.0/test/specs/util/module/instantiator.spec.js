/* eslint-env jasmine */
import Inject       from 'src/core/Inject';
import instantiator from 'src/util/module/instantiator';

describe('instantiator', () => {
    it(jasmine.mld`
        should return a function that instantiates the class
        and assigns the args to the instance
    `, () => {
        class A1 {
            static getModule() {}
        }
        class A2 {
            static getModule() {}
        }
        class A3 {
            static getModule() {}
        }

        @Inject({ a1: A1, a2: A2, a3: A3 })
        class MyClass {
            constructor(a1, a2, a3) {
                a1.passed = true;
                a2.passed = true;
                a3.passed = true;
            }
        }

        const a1i = new A1()
            , a2i = new A2()
            , a3i = new A3()
            , instance = instantiator(MyClass)(a1i, a2i, a3i);

        expect(instance.a1).toBe(a1i);
        expect(instance.a2).toBe(a2i);
        expect(instance.a3).toBe(a3i);

        expect(a1i.passed).toBe(true);
        expect(a2i.passed).toBe(true);
        expect(a3i.passed).toBe(true);
    });

    it('should pull in injection setup from parent classes', () => {
        class ParentDep {
            static getModule() {}
        }
        class ChildDep {
            static getModule() {}
        }

        @Inject({ pd: ParentDep })
        class MyParentClass {
            constructor(pd) {
                pd.passedToParent = true;
            }
        }

        @Inject({ cd: ChildDep })
        class MyChildClass extends MyParentClass {
            constructor(cd, pd) {
                super(pd);
                cd.passedToChild = true;
                pd.passedToChild = true;
            }
        }

        const cdi = new ChildDep()
            , pdi = new ParentDep()
            , instance = instantiator(MyChildClass)(cdi, pdi);

        expect(instance.cd).toBe(cdi);
        expect(instance.pd).toBe(pdi);

        expect(pdi.passedToParent).toBe(true);
        expect(pdi.passedToChild).toBe(true);
        expect(cdi.passedToParent).toBeUndefined();
        expect(cdi.passedToChild).toBe(true);
    });
});
