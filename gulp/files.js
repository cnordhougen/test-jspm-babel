const dirs = {
    coverage:     'test/coverage',
    docs:         'docs',
    jspm:         'jspm_packages',
    localization: 'lang',
    src:          'src',
};

export default {
    dirs,

    coverage:    `${dirs.coverage}/**/*.html`,
    css:         `${dirs.src}/**/*.css`,
    cssMaps:     `${dirs.src}/**/*.css.map`,
    es6:         '**/*.es6',
    js:          `${dirs.src}/**/!(*spec).js`,
    jsMaps:      `${dirs.src}/**/*.js.map`,
    karmaConfig: 'karma.conf.js',
    sass:        `${dirs.src}/**/*.scss`,
    specs:       `${dirs.src}/**/*.spec.js`,
    templates:   `${dirs.src}/**/*.template.html`,
};
