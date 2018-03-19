const gulp = require('gulp');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const jade = require('gulp-jade');

// Static Server + watching scss/html files
gulp.task('server', ['sass', 'js', 'jade-concat', 'img', 'fonts'], function() {

    browserSync.init({
        server: "./public"
    });
	gulp.watch("static/img/*.*", ['img']);
  gulp.watch("static/scss/**/*.scss", ['sass']);
  gulp.watch("static/jade/**/*.jade", ['jade-concat']);
  gulp.watch("static/fonts/*.*", ['fonts']);
  gulp.watch("static/js/**/*.js", ['js']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("static/scss/styles.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(prefixer({ browsers: ['> 1%', 'IE 9'] }))
        .pipe(gulp.dest("public/css/"))
        .pipe(browserSync.stream());
});

gulp.task("jade-concat", function(){
	gulp.src('static/jade/*.jade')
		.pipe(jade({pretty: true, compileDebug: true}))
		.pipe(gulp.dest('public/'))
    .pipe(browserSync.reload({stream:true}));
});

// Compile img into browsers
gulp.task('img', function() {
    return gulp.src("static/img/**/*.*")
        .pipe(gulp.dest("public/img/"))
        .pipe(browserSync.stream());
});
gulp.task('fonts', function() {
    return gulp.src("static/fonts/**/*.*")
        .pipe(gulp.dest("public/fonts/"))
        .pipe(browserSync.stream());
});

// Compile js auto-inject into browsers
gulp.task('js', function() {
    return gulp.src("static/js/**/*.*")
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("public/js/"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['server']);
