var gulp = require('../../node_modules/gulp');
var browser = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/browser-sync');
var requireDir = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/require-dir');
var port = process.env.SERVER_PORT || 3000;



// Builds the documentation and framework files
gulp.task('build', ['clean', 'copy', 'docs', 'docs:search', 'sass', 'javascript']);

// Starts a BrowerSync instance
gulp.task('serve', ['build'], function(){
  browser.init({server: './_build', port: port});
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['serve'], function() {
  gulp.watch('docs/**/*', ['docs', browser.reload]);
  gulp.watch('docs/layout/*.html', ['docs:reset', browser.reload]);
  gulp.watch('scss/**/*', ['sass', browser.reload]);
  gulp.watch('docs/assets/scss/**/*', ['sass:docs', browser.reload]);
  gulp.watch('js/**/*', ['javascript:foundation', browser.reload]);
  gulp.watch('docs/assets/js/**/*', ['javascript:docs', browser.reload]);
});

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
var fs = require('fs');

var octophant = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/octophant');
var Parker = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/parker/lib/Parker');
var prettyJSON = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/prettyjson');
var sass = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-sass');
var autoprefixer = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-autoprefixer');
var rename = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-rename');

var PATHS = [
  'scss',
  'node_modules/motion-ui/src'
];

var COMPATIBILITY = [
  'last 2 versions',
  'ie >= 9',
  'and_chr >= 2.3'
];

// Compiles Sass files into CSS
gulp.task('sass', ['sass:foundation', 'sass:docs']);

// Compiles Foundation Sass
gulp.task('sass:foundation', function() {
  return gulp.src('./foundation-sites.scss')
    .pipe(sass({
      includePaths: PATHS
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(rename('foundation.css'))
    .pipe(gulp.dest('../custom-f6-57hrw/css'));
});

// Compiles docs Sass (includes Foundation code also)
gulp.task('sass:docs', function() {
  return gulp.src('docs/assets/scss/docs.scss')
    .pipe(sass({
      includePaths: PATHS
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe(gulp.dest('../custom-f6-57hrw/css'));
});

// Audits CSS filesize, selector count, specificity, etc.
gulp.task('sass:audit', ['sass:foundation'], function(cb) {
  fs.readFile('./../custom-f6-57hrw/css/foundation-sites.css', function(err, data) {
    var parker = new Parker(require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/parker/metrics/All'));
    var results = parker.run(data.toString());
    console.log(prettyJSON.render(results));
    cb();
  });
});

// Generates a settings file
gulp.task('sass:settings', function() {
  var options = {
    title: 'Foundation for Sites Settings',
    output: './scss/_settings.scss',
    groups: {
      'grid': 'The Grid',
      'off-canvas': 'Off-canvas',
      'typography-base': 'Base Typography'
    }
  }

  octophant(['./scss'], options);
});

var concat = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-concat');

var FOUNDATION = [
  'js/foundation.core.js',
  'js/foundation.util.*.js',
  'js/*.js'
];

var DEPS = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/motion-ui/dist/motion-ui.js'
];

var DOCS = [
  'node_modules/zeroclipboard/dist/ZeroClipboard.js',
  'node_modules/typeahead.js/dist/typeahead.bundle.js',
  'docs/assets/js/docs.*.js',
  'docs/assets/js/docs.js'
];

// Compiles JavaScript into a single file
gulp.task('javascript', ['javascript:foundation', 'javascript:deps', 'javascript:docs']);

gulp.task('javascript:foundation', function() {
  return gulp.src(FOUNDATION)
    .pipe(concat('foundation.js'))
    .pipe(gulp.dest('../custom-f6-57hrw/js'));
});

gulp.task('javascript:deps', function() {
  return gulp.src(DEPS)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('../custom-f6-57hrw/js'));
});

gulp.task('javascript:docs', function() {
  return gulp.src(DOCS)
    .pipe(concat('docs.js'))
    .pipe(gulp.dest('../custom-f6-57hrw/js'));
});
