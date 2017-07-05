const dirs = {
    coverage:     'coverage',
    gulp:         'gulp',
    jspm:         'jspm_packages',
    localization: 'lang',
    node:         'node_modules',
    src:          'src',
};

export default {
    dirs,

    coverage:    `${dirs.coverage}/**/*.html`,
    css:         `${dirs.src}/**/*.css`,
    cssMaps:     `${dirs.src}/**/*.css.map`,
    dot:         '.*',
    es6:         '**/*.es6',
    gulpfile:    'gulpfile.babel.js',
    js:          `${dirs.src}/**/!(*spec).js`,
    jsMaps:      `${dirs.src}/**/*.js.map`,
    karmaConfig: 'karma.conf.js',
    sass:        `${dirs.src}/**/*.scss`,
    specs:       `${dirs.src}/**/*.spec.js`,
    templates:   `${dirs.src}/**/*.template.html`,
};
