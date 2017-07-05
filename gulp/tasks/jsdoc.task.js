/* eslint-env node */
export default gulp => gulp.task(
    'jsdoc',
    'Generate code documentation with JSDoc',
    {
        watch:  gulp.files.js,
        server: {
            port:    8300,
            baseDir: gulp.files.dirs.docs,
        },
    },
    () => {
        const jsdoc       = require('gulp-jsdoc3')
            , jsdocConfig = require(gulp.files.jsDocConfig); // eslint-disable-line import/no-dynamic-require

        gulp.src([ 'README.md' ].concat(gulp.files.js))
            .pipe(jsdoc(jsdocConfig));
    }
);
