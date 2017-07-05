/* eslint-env node */
export default gulp => gulp.task(
    'build-code',
    'Build/bundle source via jspm/babel.',
    [ 'babel' ],
    { watch: gulp.files.es6 },
    () => {
        const jspm       = require('gulp-jspm')
            , sourcemaps = require('gulp-sourcemaps');

        return gulp.src(gulp.files.appMain)
                   .pipe(sourcemaps.init())
                   .pipe(jspm())
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest(gulp.files.dirs.build));
    }
);
