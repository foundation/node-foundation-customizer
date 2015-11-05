
var filter = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-filter');
var minifyCss = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-minify-css');
var rename = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-rename');
var uglify = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-uglify');

gulp.task('deploy', ['deploy:dist']);

gulp.task('deploy:dist', ['sass:foundation', 'javascript:foundation'], function() {
  var cssFilter = filter(['*.css']);
  var jsFilter  = filter(['*.js']);

  return gulp.src(['../custom-f6-57hrw/css/foundation.css', '../custom-f6-57hrw/js/foundation.js'])
    .pipe(cssFilter)
      .pipe(gulp.dest('./dist'))
      .pipe(minifyCss())
      .pipe(rename('foundation.min.css'))
      .pipe(gulp.dest('./dist'))
    .pipe(cssFilter.restore())
    .pipe(jsFilter)
      .pipe(gulp.dest('./dist'))
      .pipe(uglify())
      .pipe(rename('foundation.min.js'))
      .pipe(gulp.dest('./dist'));
});
gulp.task('deploy:custom', ['sass:foundation', 'javascript:foundation'], function() {
  var cssFilter = filter(['*.css']);
  var jsFilter  = filter(['*.js']);

  return gulp.src(['../custom-f6-57hrw/css/foundation.css', '../custom-f6-57hrw/js/foundation.js'])
    .pipe(cssFilter)
      .pipe(gulp.dest('../custom-f6-57hrw/css'))
      .pipe(minifyCss())
      .pipe(rename('foundation.min.css'))
      .pipe(gulp.dest('../custom-f6-57hrw/css'))
    .pipe(cssFilter.restore())
    .pipe(jsFilter)
      .pipe(gulp.dest('../custom-f6-57hrw/js'))
      .pipe(uglify())
      .pipe(rename('foundation.min.js'))
      .pipe(gulp.dest('../custom-f6-57hrw/js'));
});
