export default gulp => gulp.task(
    'build-css',
    'Build CSS files from Sass sources',
    { watch: gulp.files.sass },
    () => {
        const sass       = require('gulp-sass')
            , rename     = require('gulp-rename')
            , minifyCSS  = require('gulp-clean-css')
            , sourcemaps = require('gulp-sourcemaps')
            , sassJspm   = require('sass-jspm-importer')

            , sassOptions = {
                errLogToConsole: true,
                functions:       sassJspm.resolve_function(gulp.files.dirs.jspm),
                importer:        sassJspm.importer,
            };

        return gulp.src(gulp.files.sass, { base: './' })
                    .pipe(sourcemaps.init())
                    .pipe(sass(sassOptions).on('error', sass.logError))
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(minifyCSS())
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest('./'));
    }
);
