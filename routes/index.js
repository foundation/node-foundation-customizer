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
var fs = Promise.promisifyAll(require('fs'));
var exec = Promise.promisify(childProcess.exec);

var env = process.env.NODE_ENV || 'development';
var config = require('../config.json');

var sitesDirectory = config[env].directory;
var foundationVersion = config[env].version;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var locked = false;

var processBody = function(originalBody) {
  var results = {}
  results.modules = originalBody['modules'] || [];
  results.variables = originalBody.variables || {};
  if(originalBody.grid_type === 'grid') {
    results.modules.push('grid');
  } else if (originalBody.grid_type === 'flex_grid') {
    results.modules.push('grid');
    results.variables['global-flexbox'] = 'true';
  }

  return results;
};

// pass in the request, and optionally a config object (otherwise it will get pulled of the body).
// Lets us pass in explicit objects for the full download and essential
var writeJson = function(req) {
  var configObject = processBody(req.body)
  var config = JSON.stringify(configObject);
  var hash = md5(config);
  var filename = '/tmp/tmp.' + hash + '.json';
  req.jsonFilename = filename;
  req.outputDir = '/tmp/tmp.' + hash;
  return fs.writeFileAsync(filename, config);
};

var getFile = function(req, res) {
    fs.existsAsync(req.outputDir + '.zip').
    then(function(exists) {
      var command = 'gulp customizer --modules ' + req.jsonFilename + ' --output ' + req.outputDir;
      debug(command);
      return exec(command, {cwd: sitesDirectory});
    }).catch(function() {
      return new Promise(function(resolve) {
        resolve();
      });
    }).
    then(function() {
      var file = req.outputDir + '.zip';
      // TODO:  make this pull from config
      res.download(file, 'foundation-' + foundationVersion + '.zip');
    });
}

router.post('/custom-f6', function(req, res, next) {
  writeJson(req).then(function() {
    getFile(req, res);
  });
});

router.get('/complete', function(req, res, next) {
  req.jsonFilename = path.resolve(sitesDirectory + '/customizer/complete.json');
  req.outputDir = '/tmp/foundation-' + foundationVersion + '.complete';
  getFile(req, res);
});

router.get('/essential', function(req, res, next) {
  req.jsonFilename = path.resolve(sitesDirectory + '/customizer/essential.json');
  req.outputDir = '/tmp/foundation-' + foundationVersion + '.essential';
  getFile(req, res);
});

module.exports = router;
