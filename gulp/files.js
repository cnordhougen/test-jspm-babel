const dirs = {
    build:        'build',
    coverage:     'test/coverage',
    docs:         'docs',
    jspm:         'jspm_packages',
    localization: 'lang',
    src:          'src',
    styles:       'sass',
};

export default {
    dirs,

    appMain:     `${dirs.src}/app/App.module.js`,
    build:       `${dirs.build}/*`,
    coverage:    `${dirs.coverage}/**/*.html`,
    css:         `${dirs.src}/**/*.css`,
    es6:         '**/*.es6',
    js:          `${dirs.src}/**/!(*spec).js`,
    jsDocConfig: 'jsdoc.conf.json',
    jsMaps:      `${dirs.src}/**/*.js.map`,
    karmaConfig: 'karma.conf.js',
    sass:        `${dirs.src}/**/*.scss`,
    specs:       `${dirs.src}/**/*.spec.js`,
    templates:   `${dirs.src}/**/*.template.html`,

    static: {
        recursive: [
            `${dirs.localization}/**/*.json`,
        ],
        flat: [
            `${dirs.jspm}/system.js`,
            'config.js',
            'src/index.html',
        ],
    },
};
