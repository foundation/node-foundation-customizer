var debug = require('debug')('node-foundation-customizer:server');
var express      = require('express');
var archiver     = require('archiver')
var md5          = require('md5');
var app          = require('../app')
var path = require('path');
var rimraf       = require('rimraf')
var router = express.Router();
var childProcess = require('child_process')
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require('fs'))
Promise.promisify(childProcess.execFile)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var locked = false;

var processBody = function(originalBody) {
  var results = {}
  debug(originalBody);
  results.modules = originalBody['modules'];
  results.variables = originalBody.variables;
  if(originalBody.grid_type === 'grid') {
    results.modules.push('grid');
  } else if (originalBody.grid_type === 'flex_grid') {
    results.modules.push('grid');
    results.variables['global-flexbox'] = 'true';
  }

  return results;
};

var writeJson = function(req) {
  var config = JSON.stringify(processBody(req.body));
  var hash = md5(config)
  var filename = 'tmp.' + hash + '.json';
  req.jsonFilename = filename;
  return fs.writeFileAsync(filename, config);
};

router.post('/custom-f6', function(req, res, next) {
  writeJson(req).then(function() {
    res.send(req.jsonFilename);
  });

  //res.download(file);
});

module.exports = router;
