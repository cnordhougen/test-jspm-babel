
const CORE_REPLS = [
    {
        description: 'Strip [] from attribute names',
        replace:     /\[([^[\]]+)]="/g,
        with:        (m, attrName) => `${attrName}="`,
    },
    {
        description: 'Strip () from attribute names',
        replace:     /\(([^)]+)\)="/g,
        with:        (m, attrName) => `${attrName}="`,
    },
    {
        description: '<ng-content></ng-content> => <ng-transclude></ng-transclude>',
        replace:     /<(\/)?ng-content>/g,
        with:        (m, slash) => `<${slash || ''}ng-transclude>`,
    },
];

const REPL_KEY     = Symbol('replacements')
    , REPL_IDS_KEY = Symbol('repl_ids');

const ngfTemplate = {
    get(cdef, importBase) {
        return (new Promise((resolve, reject) => {
            if (cdef.template) {
                resolve(cdef.template);
            } else if (cdef.templateUrl) {
                System.import(`${importBase}${cdef.templateUrl}!text`).then(resolve).catch(reject);
            } else {
                reject('Component definition must have either a template or a templateUrl');
            }
        })).then(ngfTemplate.transform);
    },

    transform(template) {
        for (const repl of ngfTemplate[REPL_KEY]) {
            template = template.replace(repl.replace, repl.with);
        }

        return template;
    },

    registerAllReplacements(id, replList = []) {
        if (!ngfTemplate[REPL_IDS_KEY].includes(id)) {
            for (const repl of replList) {
                if (typeof repl.with === 'function') {
                    repl.with = repl.with.bind(repl);
                }
            }
            Array.prototype.unshift.apply(ngfTemplate[REPL_KEY], replList);
            ngfTemplate[REPL_IDS_KEY].push(id);
        }
    },
};
Object.defineProperties(ngfTemplate, {
    [REPL_KEY]:     { value: [] },
    [REPL_IDS_KEY]: { value: [] },
});

ngfTemplate.registerAllReplacements('Core', CORE_REPLS);

export default ngfTemplate;
