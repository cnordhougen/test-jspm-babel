const dirs = {
    source:   'src',
    test:     'test',
    coverage: 'test/coverage',
    jspm:     'jspm_packages'
};

module.exports = {
    dirs,
    source:    `${dirs.source}/**/*.js`,
    specs:     `${dirs.test}/specs/**/*.spec.js`,
    // specs:     `${dirs.test}/specs/core/Component.spec.js`,
    testSetup: `${dirs.test}/setup.js`,
    testMeta:  `${dirs.test}/*.!(js)`
};
