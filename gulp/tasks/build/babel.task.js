export default gulp => gulp.task(
    'babel',
    'Transpile test',
    { watch: gulp.files.es6 },
    () => {
        const babel      = require('gulp-babel')
            , sourcemaps = require('gulp-sourcemaps');

        return gulp.src(gulp.files.es6, { base: './' })
                   .pipe(sourcemaps.init())
                   .pipe(babel())
                   .pipe(sourcemaps.write('./'))
                   .pipe(gulp.dest('./'));
    }
);
