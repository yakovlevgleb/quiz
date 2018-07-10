'use strict';

const dirs = {
	source: 'static', // папка с исходниками (путь от корня проекта)
	build: 'public1' // папка с результатом работы (путь от корня проекта)
};

const images = [dirs.source + '/img/**/*.{gif,png,jpg,jpeg,svg,ico}'];

// Cписок обрабатываемых файлов в указанной последовательности
const jsList = [
	dirs.source + '/js/ext/jquery.min.js',
	dirs.source + '/js/ext/owl.carousel.min.js',
	dirs.source + '/js/ext/jquery.inputmask.bundle.min.js',
	dirs.source + '/js/ext/jquery.formstyler.min.js',
	dirs.source + '/js/main.js'
];

const folder = process.env.folder;

const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const objectFitImages = require('postcss-object-fit-images');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const jade = require('gulp-jade');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-cleancss');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const uglify = require('gulp-uglify');
const wait = require('gulp-wait');

gulp.task('clean', function() {
	return del(dirs.build);
})

let postCssPlugins = [
	autoprefixer({browsers: ['last 2 version']}),
	mqpacker({sort: true}),
	objectFitImages()
];

gulp.task('sass', function() {
	return gulp.src(dirs.source + '/scss/styles.scss'). // какой файл компилировать
	pipe(plumber({ // при ошибках не останавливаем автоматику сборки
		errorHandler: function(err) {
			notify.onError({title: 'Styles compilation error', message: err.messagegulp})(err);
			this.emit('end');
		}
	})).pipe(wait(100)).pipe(sourcemaps.init()). // инициируем карту кода
	pipe(sass()). // компилируем
	// pipe(postcss(postCssPlugins)). // делаем постпроцессинг
	pipe(sourcemaps.write('/')). // записываем карту кода как отдельный файл
	pipe(gulp.dest(dirs.build + '/css/')). // записываем CSS-файл
	pipe(browserSync.stream({match: '**/*.css'})). // укажем browserSync необходимость обновить страницы в браузере
	pipe(rename('styles.min.css')). // переименовываем (сейчас запишем рядом то же самое, но минимизированное)
	pipe(cleanCSS()). // сжимаем и оптимизируем
	pipe(gulp.dest(dirs.build + '/css/')); // записываем CSS-файл
});

gulp.task("jade-concat", function() {
	gulp.src(dirs.source + '/jade/*.jade').pipe(plumber({
		errorHandler: notify.onError(function(error) {
			return {title: "Jade compilation error", message: error.message}
		})
	})).pipe(jade({pretty: true, compileDebug: true})).pipe(gulp.dest(dirs.build + '/')).pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src(dirs.source + "/img/**/*.*").pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{
					removeViewBox: true
				}, {
					cleanupIDs: false
				}
			]
		})
	])).pipe(gulp.dest(dirs.build + "/img/")).pipe(browserSync.stream());
});

gulp.task('img:opt', function(callback) {
	if (folder) {
		return gulp.src(folder + '/*.{jpg,jpeg,gif,png,svg}').pipe(imagemin({
			progressive: true,
			svgoPlugins: [
				{
					removeViewBox: false
				}
			],
			use: [pngquant()]
		})).pipe(gulp.dest(folder));
	} else {
		console.log('Не указана папка с картинками. Пример вызова команды: folder=src/blocks/test-block/img npm start img:opt');
		callback();
	}
});

gulp.task('fonts', function() {
	return gulp.src([dirs.source + '/fonts/**/*.{ttf,woff,woff2,eot,svg}']).pipe(gulp.dest(dirs.build + '/fonts/'));
});

// Конкатенация и углификация Javascript
gulp.task('js', function() {
	if (jsList.length) {
		return gulp.src(jsList).pipe(plumber({
			errorHandler: notify.onError(function(error) {
				return {title: "JS compilation error", message: error.message}
			})
		})). // не останавливаем автоматику при ошибках
		pipe(concat('script.min.js')). // конкатенируем все файлы в один с указанным именем
		pipe(uglify()). //      сжимаем
		pipe(gulp.dest(dirs.build + '/js')); // записываем
	} else {
		console.log('Javascript не обрабатывается');
		callback();
	}
});

gulp.task('build', function(callback) {
	gulpSequence('clean', 'sass', 'js', 'jade-concat', 'img', 'fonts', callback);
});

gulp.task('serve', ['build'], function() {

	browserSync.init({server: dirs.build, startPath: 'index.html', open: false, port: 8080});

	if (images.length) {
		gulp.watch(images, ['img']);
	}
	gulp.watch(dirs.source + "/scss/**/*.scss", ['sass']);
	gulp.watch(dirs.source + "/jade/**/*.jade", ['jade-concat']);
	gulp.watch(dirs.source + '/fonts/*.{ttf,woff,woff2,eot,svg}', ['fonts']);
	gulp.watch(dirs.source + "/js/**/*.js", ['js']);

});

gulp.task('default', ['serve']);
