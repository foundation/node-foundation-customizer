var gulp = require('gulp');
var open = require('open');
var $    = require('gulp-load-plugins')();
var childProcess = require('child_process')

var sassPaths = [
  'bower_components/foundation/scss'
];

var jsPaths = [
  'bower_components/jquery-placeholder/jquery.placeholder.js',
  'bower_components/fastclick/lib/fastclick.js',
  'bower_components/jquery/dist/jquery.js',
  'bower_components/jquery.cookie/jquery.cookie.js',
  'bower_components/modernizr/modernizr.js',
  'bower_components/foundation/js/foundation.js',
  'assets/javascripts/app.js'
];

gulp.task('js', function(){
  return gulp.src(jsPaths)
  .pipe($.concat('app.js'))
  .pipe(gulp.dest('./public/javascripts'))
  .pipe($.livereload())
})
gulp.task('sass', function() {
  return gulp.src('./assets/scss/style.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'nested',
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe($.livereload());
});
gulp.task('views', function() {
  return gulp.src('./views/**/*.ejs')
    .pipe($.livereload());
});
gulp.task('run', function(){
  var fork = childProcess.spawn(process.env.SHELL, ['-c', 'DEBUG=node-foundation-customizer:* node ./bin/www']);
  open('http://localhost:3000');
  fork.stdout.on('data', function (data) {
    bool=false;
    var output = data.toString().split('\n')
    for(var i=0; i<output.length-1; i++){
      console.log(output[i]);
    }
  });
  fork.stderr.on('data', function (data) {
    var output = data.toString();
    console.log(output);
  });
})
gulp.task('default', ['sass', 'js', 'run'], function() {
  $.livereload.listen();
  gulp.watch(['./assets/**/*.scss'], ['sass']);
  gulp.watch(['./assets/**/*.js'], ['js']);
  gulp.watch(['./views/**/*.ejs'], ['views']);

});
