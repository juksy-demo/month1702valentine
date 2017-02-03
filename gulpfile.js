var gulp = require('gulp'),
	gulpSass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	uglifycss = require('gulp-uglifycss');

// make scss to css file
gulp.task('make:scss',function(){
	return gulp.src('scss/index.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('css'));
}); 

// combine and uglify css to one
gulp.task('uglify:css', ['make:scss'], function(){
	return gulp.src([
			'node_modules/animate.css/animate.css',
			'css/plugin/lightslider/lightslider.css',
			'css/plugin/photoswipe/photoswipe.css',
			'css/plugin/photoswipe/default-skin.css',
			'css/index.css'
		])
		.pipe(concat('app.min.css'))
		.pipe(uglifycss())
		.pipe(gulp.dest('css'));
});

// combine and uglify plugin-js to one file
gulp.task('uglify:plugin-js', ['uglify:css'], function(){
	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/wowjs/dist/wow.js',
			'node_modules/jquery.dotdotdot/src/js/jquery.dotdotdot.js',
			'node_modules/lodash/lodash.js',
			'node_modules/handlebars/dist/handlebars.js',
			'node_modules/lightslider/dist/js/lightslider.js',
			'node_modules/photoswipe/dist/photoswipe.js',
			'node_modules/photoswipe/dist/photoswipe-ui-default.js',
			'node_modules/clipboard/dist/clipboard.js'
		])
		.pipe(concat('app.assets.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

// uglify main-js
gulp.task('uglify:main-js', ['uglify:plugin-js'], function(){
	return gulp.src([
			'js/index.js'
		])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

gulp.task('default',['uglify:main-js']);