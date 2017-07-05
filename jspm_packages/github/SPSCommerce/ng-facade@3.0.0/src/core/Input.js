import MetadataKey from '../util/metadata/MetadataKey';
import ngfMetadata from '../util/metadata/ngfMetadata';

function Input(alias) {
    return (t, name, descriptor) => {
        const T = t.constructor;

        if (!descriptor.get && !descriptor.set) {
            descriptor.writable = true;
        }

        const inputs = ngfMetadata.get(MetadataKey.INPUT, T, {});
        inputs[name] = {
            oneWay:      !descriptor.writable,
            initializer: descriptor.initializer,
            alias
        };
        ngfMetadata.define(MetadataKey.INPUT, inputs, T);

        const binds = ngfMetadata.get(MetadataKey.BINDS, T, {})
            , type  = inputs[name].initializer ? '=?' : '='
            , attr  = (inputs[name].alias || name).toLowerCase();

        binds[name] = `${type}${attr}`;
        ngfMetadata.define(MetadataKey.BINDS, binds, T);
    };
}
Input.ngfLink = (T, scope, element, attrs, ctrl) => {
    if (ngfMetadata.has(MetadataKey.INPUT, T)) {
        const inputs = ngfMetadata.get(MetadataKey.INPUT, T)
            , names  = Object.keys(inputs);

        for (const name of names) {
            if (typeof ctrl[name] === 'undefined') {
                ctrl[name] = inputs[name].default;
            }
        }

        if (ctrl.ngOnChanges) {
            scope.$watchGroup(names.map(n => `ctrl.${n}`), (newValues, oldValues) => {
                let changes = newValues.map((v, i) => {
                    return {
                        i,
                        change: {
                            currentValue:  v,
                            previousValue: oldValues[i],
                            firstChange:   false,
                            isFirstChange() {
                                return this.firstChange;
                            }
                        },
                    };
                });
                
                if (changes.find(c => c.change.currentValue !== c.change.previousValue)) {
                    changes = changes.filter(c => c.change.currentValue !== c.change.previousValue);
                } else {
                    for (const c of changes) {
                        c.change.firstChange = true;
                    }
                }

                changes = changes.reduce((o, c) => {
                    o[names[c.i]] = c.change;
                    return o;
                }, {});

                ctrl.ngOnChanges(changes);
            });
        }
    }
};

export default Input;
