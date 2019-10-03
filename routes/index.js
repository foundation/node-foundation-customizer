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
  } else if (originalBody.grid_type === 'xy_grid') {
    results.modules.push('xy_grid');
    results.modules.push('flex_classes');
  } else if (originalBody.grid_type === 'flex_grid') {
    results.modules.push('flex_grid');
    results.modules.push('flex_classes');
    results.variables['global-flexbox'] = 'true';
  }


  if(results.modules.indexOf('menu') !== -1) {
    results.modules.push('menu_icon');
  }
  // Some browsers (safari 9) don't submit the non-user-entered values in colors/rem/px, so we need to check and adjust
  var colors = ["primary-color","secondary-color","alert-color","success-color","warning-color","body-font-color","header-color"];
  for(var i = 0; i < colors.length; i ++) {
    if (results.variables[colors[i]][0] !== '#') {
      results.variables[colors[i]] = '#' + results.variables[colors[i]];
    }
  }

  var endsInRem = ["grid-column-gutter","global-width"];
  for(var i = 0; i < endsInRem.length; i ++) {
    if (results.variables[endsInRem[i]].slice(-3) !== 'rem') {
      results.variables[endsInRem[i]] = results.variables[endsInRem[i]] + 'rem';
    }
  }

  // We should let folks individually customize margin and padding for XY, but for now
  // just piggy back on existing gutters
  results.variables['grid-margin-gutters'] = results.variables['grid-column-gutter'];
  results.variables['grid-columns'] = results.variables['grid-column-count'];

  var endsInPx = ["global-radius"]
  for(var i = 0; i < endsInPx.length; i ++) {
    if (results.variables[endsInPx[i]].slice(-2) !== 'px') {
      results.variables[endsInPx[i]] = results.variables[endsInPx[i]] + 'px';
    }
  }
  return results;
};

// pass in the request, and optionally a config object (otherwise it will get pulled of the body).
// Lets us pass in explicit objects for the full download and essential
var writeJson = function(req) {
  var configObject = processBody(req.body)
  var config = JSON.stringify(configObject);
  var hash = md5(config);
  var filename = '/tmp/tmp.' +foundationVersion + '.' + hash + '.json';
  req.jsonFilename = filename;
  req.outputDir = '/tmp/tmp.' + foundationVersion + '.'  + hash;
  return fs.writeFileAsync(filename, config);
};

var getFile = function(req, res) {
    fs.existsAsync(req.outputDir + '.zip').
    then(function() {
      var command = './node_modules/.bin/gulp customizer --modules ' + req.jsonFilename + ' --output ' + req.outputDir;
      debug(command);
      return exec(command, {cwd: sitesDirectory});
    }).catch(function(error) {
      debug(error);
      return new Promise(function(resolve) {
        resolve();
      });
    }).
    then(function() {
      var file = req.outputDir + '.zip';
      // TODO:  make this pull from config
      res.download(file, req.downloadName);
    });
}

router.post('/custom-f6', function(req, res, next) {
  req.downloadName = 'foundation-' + foundationVersion + '-custom.zip';
  writeJson(req).then(function() {
    getFile(req, res);
  });
});

router.get('/complete', function(req, res, next) {
  req.jsonFilename = path.resolve(sitesDirectory + '/customizer/complete.json');
  req.outputDir = '/tmp/foundation-' + foundationVersion + '.complete';
  req.downloadName = 'foundation-' + foundationVersion + '-complete.zip';
  getFile(req, res);
});

router.get('/essential', function(req, res, next) {
  req.jsonFilename = path.resolve(sitesDirectory + '/customizer/essential.json');
  req.outputDir = '/tmp/foundation-' + foundationVersion + '.essential';
  req.downloadName = 'foundation-' + foundationVersion + '-essential.zip';
  getFile(req, res);
});

module.exports = router;
