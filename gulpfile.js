// Gulp Plugins
// // // // // // // // // // // // // // // //
// SHARED
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
// for clean task
var del = require('del');
// for javascript task
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
// for css task
var sass = require('gulp-sass');
var neat = require('node-neat');
var prefix = require('gulp-autoprefixer');
// for templates task
var templateCache = require('gulp-angular-templatecache');
// for browser-sync task
var browserSync = require('browser-sync').create();
// for nodemon task
var nodemon = require('gulp-nodemon');

// ON error
function onError(error) {
  gutil.beep();
  gutil.log(gutil.colors.red(error.message));
  this.emit('end');
}

// Clean old /dist directory task,
// to make room for new /dist build
gulp.task('clean', function () {
  return del(['./dist/**/*']);
});

// Javascript Task
gulp.task('javascript', function () {
  return gulp.src([
      'node_modules/angular/angular.min.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'public/ngApp/app.module.js',
      'public/ngApp/**/*.js'
    ])
    .pipe(plumber(onError))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    // .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// CSS Task
gulp.task('css', function () {
  return gulp.src('./public/css/main.sass')
    .pipe(plumber(onError))
    .pipe(sass({
      includePaths: neat.includePaths
    }))
    .pipe(prefix(['last 2 versions', 'ie 9'], {
      cascade: true
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// HTML Task
gulp.task('html', function () {
  return gulp.src(['./public/index.html'])
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// templates task
gulp.task('templates', function () {
  return gulp.src('./public/ngApp/**/*.{html,jade}')
    .pipe(templateCache({
      standalone: true,
      moduleSystem: 'IIFE'
    }))
    .pipe(gulp.dest('./public/ngApp'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// images / icons
gulp.task('icons', function () {
  return gulp.src('public/images/*.*')
    .pipe(gulp.dest('./dist/images'));
});

// nodemon task
// runs and refreshes node server
gulp.task('nodemon', function (cb) {
  // We use this `called` variable to make sure the callback is only executed once
  var called = false;
  return nodemon({
      script: 'server.js',
      watch: ['server.js', 'app/**/*.*']
    })
    .on('start', function onStart() {
      if (!called) {
        cb();
      }
      called = true;
    })
    .on('restart', function onRestart() {

      // Also reload the browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: true
        });
      }, 500);
    });
});

// browserSync task
// Make sure `nodemon` is started before running `browser-sync`.
gulp.task('browser-sync', ['nodemon'], function () {
  var port = process.env.PORT || 5000;
  browserSync.init({

    // All of the following files will be watched
    files: ['public/**/*.*'],

    // Tells BrowserSync on where the express app is running
    // so when this is localhost it doesnt load the page but when it is 127.0.0.1 it works
    proxy: 'http://127.0.0.1:' + port,

    // This port should be different from the express app çport
    port: 4000,

    // Do not mirror any actions across browsers
    ghostMode: false

  });
});

// Watch task
gulp.task('watch', function () {
  gulp.watch('./public/ngApp/**/*.{html,jade}', ['templates', 'javascript']);
  gulp.watch('./public/ngApp/**/*.js', ['javascript']);
  gulp.watch('./public/css/**/*.{sass,scss}', ['css']);
  gulp.watch('./public/index.html', ['html']);
  gulp.watch('./public/images/*.*', ['icons']);
});

// Default Task
gulp.task('default', [
  'templates',
  'javascript',
  'css',
  'html',
  'icons',
  'browser-sync',
  'watch'
]);
