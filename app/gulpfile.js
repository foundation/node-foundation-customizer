var gulp = require('gulp');
var open = require('open');
var $    = require('gulp-load-plugins')();
var childProcess = require('child_process')


gulp.task('js', function(){
  return gulp.src('assets/javascripts/app.js')
  .pipe($.concat('app.js'))
  .pipe(gulp.dest('./public/javascripts'))
  .pipe($.livereload())
})
gulp.task('sass', function() {
  return gulp.src('./assets/scss/style.scss')
    .pipe($.sass())
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
  fork.stderr.on('data', function (data) {
    var output = data.toString();
    console.log(output);
  });
})
gulp.task('default', ['sass', 'js', 'run'], function() {
  //$.livereload.listen();
  gulp.watch(['./assets/**/*.scss'], ['sass']);
  gulp.watch(['./assets/**/*.js'], ['js']);
  gulp.watch(['./views/**/*.ejs'], ['views']);
  open('http://localhost:3000');
});
