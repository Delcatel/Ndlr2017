var autoprefixer   = require('gulp-autoprefixer');
var concat         = require('gulp-concat');
var gulp           = require('gulp');
var gutil          = require('gulp-util');
var jshint         = require('gulp-jshint');
var less           = require('gulp-less');
var sourcemaps     = require('gulp-sourcemaps');
var uglify         = require('gulp-uglify');
var uglifycss      = require('gulp-uglifycss');

/**
 * Vérifie la syntaxe JS
 */
gulp.task('lint-js', function() {
    var appFiles = [
        'js/*.js'
    ];
    return gulp.src(appFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
    ;
});

/**
 * Construit le fichier JS
 */
gulp.task('build-js', function() {
    var appFiles = [
        'js/**/*.js'
    ];

    var ndlr = gulp.src(appFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('ndlr.js'))
    ;

    return ndlr
        .pipe(concat('ndlr.min.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? sourcemaps.write('maps') : gutil.noop())
        .pipe(gulp.dest('www/'))
    ;
});

/**
 * Construit le CSS
 */
gulp.task('build-css', function() {
    var appFiles = [
        'css/**/*.less',
        'css/**/*.css'
    ];
    return gulp.src('css/ndlr.less')
        .pipe(concat('ndlr.min.css'))
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gutil.env.type === 'production' ? uglifycss() : gutil.noop())
        .pipe(gulp.dest('www/'))
    ;
});

/**
 * Définition du WATCH
 */
gulp.task('watch', function() {
    gulp.watch(['js/*.js'], ['lint-js', 'build-js']);
    gulp.watch(['css/**/*.less', 'css/**/*.css'], ['build-css']);
});

/**
 * Définition du BUILD
 */
gulp.task('build', [
    'build-js',
    'build-css',
]);

/**
 * Tache par défaut
 */
gulp.task('default', ['build', 'watch']);
