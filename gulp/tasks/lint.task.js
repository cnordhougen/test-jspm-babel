/* eslint-env node */
export default gulp => gulp.task(
    'lint',
    'Lint source files with ESLint',
    { watch: gulp.files.es6 },
    () => {
        const cache  = require('gulp-cached')
            , eslint = require('gulp-eslint');

        return gulp.src(gulp.files.es6)
                   .pipe(cache('lint'))  // Only lint changed or uncached files
                   .pipe(eslint())
                   .pipe(eslint.format())
                   .pipe(eslint.failAfterError());
    }
);
