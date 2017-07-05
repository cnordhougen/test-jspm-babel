import A1InjectToken from './A1InjectToken';

class InjectionSetup {
    constructor(list = []) {
        this.variableNames = [];
        this.$inject = [];
        this.ngfModules = [];
        this.classes = {};

        for (const i of list) {
            if (i && Object.getPrototypeOf(i) === Object.prototype) {
                for (const k of Object.keys(i)) {
                    this.add(k, i[k]);
                }
            } else if (i instanceof Array) {
                this.add(...i);
            } else {
                this.add(i);
            }
        }
    }

    add(kOrV, vArg) {
        let k = vArg ? kOrV : null,
            v = vArg = vArg || kOrV;

        if (typeof v === 'function' && v.inject) {
            v = v.inject;
        } else if (v instanceof A1InjectToken) {
            v = v.key;
        } else if (v.getModule) {
            this.ngfModules.push(v);
            v = v.name;
        } else if (typeof v !== 'string') {
            throw new TypeError('Invalid argument to InjectionSetup#add', v);
        }

        k = k || v;

        this.variableNames.push(k);
        this.$inject.push(v);
        if (typeof vArg === 'function' && vArg.inject) {
            this.classes[k] = vArg;
        }
    }

    concat(iSetup) {
        if (!(iSetup instanceof InjectionSetup)) {
            throw new TypeError('Argument to InjectionSetup#concat must be an InjectionSetup');
        }
        this.variableNames = this.variableNames.concat(iSetup.variableNames);
        this.$inject = this.$inject.concat(iSetup.$inject);
        this.ngfModules = this.ngfModules.concat(iSetup.ngfModules);
        Object.assign(this.classes, iSetup.classes);
        return this;
    }
}

export default InjectionSetup;
