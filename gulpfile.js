	require('es6-promise').polyfill();
	var gulp          = require('gulp');
	var plumber 	 	 	= require('gulp-plumber');
	var autoprefixer  = require('gulp-autoprefixer');
	var sass 		  		= require('gulp-sass');
	var watch 		  	= require('gulp-watch');
	var minifyCSS 	  = require('gulp-minify-css');
	var uglify 		  	= require('gulp-uglify');
	var merge2 		  	= require('merge2');
	var ignore 		  	= require('gulp-ignore');
	var rimraf 		  	= require('gulp-rimraf');
	var rename 		  	= require('gulp-rename');
	var gutil 		  	= require('gulp-util');
	var concat 		  	= require('gulp-concat');
	var jshint 		  	= require('gulp-jshint');
	var uglify 		  	= require('gulp-uglify');
	var imagemin 	  	= require('gulp-imagemin');
	var browserSync   = require('browser-sync').create();
	var reload		  	= browserSync.reload;

	var errorLog = function (err) {
		console.log('SASS error:', gutil.colors.magenta(err.message));
		gutil.beep();
		this.emit('end');
	};

	gulp.task('sass', function() {
		return gulp.src('./sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./'))
	});

	// Run: gulp sass
	// Compiles SCSS files in CSS
	gulp.task('sass', function () {
	gulp.src('./sass/*.scss')
	  .pipe(plumber({ errorHandler: errorLog }))
	  .pipe(sass())
	  .pipe(gulp.dest('./css'));
	});

	// Run: gulp minifycss
	// Minifies CSS files
	gulp.task('minifycss', ['cleancss'], function(){
	return gulp.src('./css/*.css')
		.pipe(plumber())
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCSS({keepBreaks:false}))
		.pipe(gulp.dest('./css/'));
	}); 

	// Run: gulp cleancss
	// Cleans CSS files
	gulp.task('cleancss', function() {
		return gulp.src('./css/*.min.css', { read: false }) // much faster 
		.pipe(rimraf());
	});

	// Run: gulp js
	// JS validation and minimization
	gulp.task('js', function() {
		return gulp.src(['./js/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('app.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./js'))
	});

	// Run: gulp images
	// Optimizes theme images
	gulp.task('images', function() {
		return gulp.src('./img/sources/*')
		.pipe(plumber({errorHandler: onError}))
		.pipe(imagemin({optimizationLevel: 8, progressive: true}))
		.pipe(gulp.dest('./img/optimized'));
	});

	// Run: gulp watch
	// Starts watcher to run browserSync, sass, minifycss, js and images tasks on change
	gulp.task('watch', function () {
		gulp.watch('./sass/**/*.scss', ['sass', reload]);
		gulp.watch('./css/style.css', ['minifycss', reload]);
		gulp.watch('./js/*.js', ['js', reload]);
		gulp.watch('img/sources/*', ['images', reload]);
		browserSync.init({
			files: ['./**/*.php'],
			proxy: 'http://alejandravilla.dev/', // update to match your local environment URL
		});
	});

	// Run: gulp
	// Default task for browserSync, sass, minifycss, js and images
	gulp.task('default', ['sass', 'minifycss', 'js', 'images', 'watch']);