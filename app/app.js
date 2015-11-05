var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var childProcess = require('child_process');
var helper = require('./helper')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.gitlock=false;
childProcess.exec("stat public/assets/complete-f6.zip",function(err, data){

  if(err) {
    console.log("Creating essential and complete zips before launching app....")
    helper.createCompleteAndEssential();
  }
})
setInterval(function(){
  console.log("BEGIN")
  app.gitlock=true;
  if(childProcess.execFileSync(process.env.SHELL,['-c', "git pull"], {cwd: '../../foundation-sites-6'}).toString() != 'Already up-to-date.\n'){
    app.gitlock=false;
    childProcess.execFileSync(process.env.SHELL,['-c', "npm install && bower install"], {cwd: '../../foundation-sites-6'})
    helper.createCompleteAndEssential();
  }
  console.log(childProcess.execFileSync(process.env.SHELL,['-c', "stat public/assets/complete-f6.zip"]))
  app.gitlock=false;
}, 60000)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
