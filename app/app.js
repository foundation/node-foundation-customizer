var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('node-foundation-customizer:server');
var routes = require('./routes/index');
var users = require('./routes/users');
var childProcess = require('child_process');
var helper = require('./helper')
var Promise = require("bluebird");
Promise.promisify(helper.createCompleteAndEssential)
Promise.promisify(childProcess.execFile)
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
app.use('/sites/download', express.static(path.join(__dirname, 'public')));
app.use('/sites/download', routes);
app.use('/sites/download.html', express.static(path.join(__dirname, 'public')));
app.use('/sites/download.html', routes);
app.use('/users', users);
childProcess.execFileAsync(process.env.SHELL, ['-c', "stat public/assets/complete-f6.zip"])
.catch(function(e){
  debug("Creating essential and complete zips before launching app....")
  helper.createCompleteAndEssential();
})
setInterval(function(){
  debug("Checking for updates...")
  var fork=childProcess.execFile(process.env.SHELL, ['-c',"git pull"], {cwd:'../../foundation-sites'}, function(err, stdout, stderr){
    if(err) debug(stderr)
    else if(stdout != 'Already up-to-date.\n'){
      debug(stdout)
      debug("Updates found. Rebuilding complete and essential zips...")
      var fork=childProcess.spawn(process.env.SHELL,['-c', "npm install && bower install"],{cwd: '../../foundation-sites'})
      fork.stdout.on('data', function (data) {
      });
      fork.stderr.on('data', function (data) {
        var output = data.toString();
        debug(output);
      });
      fork.on('close', function(code){
        var wait = function(){
          console.log("Waiting for folder lock on foundation-sites to be released...")
          if(app.gitlock) setTimeout(wait,1000);
          else go();
        }

        var go = function(){
          app.gitlock=true;
          debug("Locked f6 folder to prepare for update.")
          var forkeroo=childProcess.spawn(process.env.SHELL,['-c', 'rsync -av --progress ../../foundation-sites/* ../../f6'])
          forkeroo.stdout.on('data', function (data) {

            var output = data.toString().split('\n')
            for(var i=0; i<output.length-1; i++){
            }
          });
          forkeroo.stderr.on('data', function (data) {
            var output = data.toString();
          });
          forkeroo.on('close',function(){
            debug("Unlocked f6 folder. Update succeeded.")
            app.gitlock=false;
            helper.createCompleteAndEssential();
          })
        }
        if(app.gitlock) wait();
        else go();

      });
    }
    else debug("Foundation folder is up to date.")
  })

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
