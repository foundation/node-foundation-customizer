var fs = require('fs');

var octophant = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/octophant');
var Parker = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/parker/lib/Parker');
var prettyJSON = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/prettyjson');
var sass = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-sass');
var autoprefixer = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-autoprefixer');
var rename = require('/Users/emellum/Desktop/projects/node-foundation-customizer/app/../../foundation-sites-6/node_modules/gulp-rename');

var PATHS = [
  'scss',
  '../../../../foundation-sites-6/node_modules/motion-ui/src'
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
