var archiver     = require('archiver')
var fs       = require('fs');
var rimraf       = require('rimraf')
var debug = require('debug')('node-foundation-customizer:server');
var app = require('./app')
var Promise = require("bluebird");
var childProcess = Promise.promisifyAll(require('child_process'));
exports.createCompleteAndEssential=function(){
  childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/temp-complete/{css,js,img}"])
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'sed -i "s|\'node_modules/jquery/dist/jquery.js\',|\'node_modules/jquery/dist/jquery.js\'|g" ../../f6/gulp/javascript.js']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'sed -i "s|\'node_modules/motion-ui/dist/motion-ui.js\',||g" ../../f6/gulp/javascript.js']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'sed -i "s|\'node_modules/what-input/what-input.js\'||g" ../../f6/gulp/javascript.js']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "echo \"@import '../node_modules/motion-ui/src/motion-ui';\" >> ../../f6/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "echo '@include motion-ui-transitions;' >> ../../f6/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "echo '@include motion-ui-animations;' >> ../../f6/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "gulp deploy:custom && rm _build/assets/css/foundation-flex* && rm _build/assets/css/*.map"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./_build/assets/css/*.css ../node-foundation-customizer/app/assets/temp-complete/css"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./_build/assets/js/*.js ../node-foundation-customizer/app/assets/temp-complete/js"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp -r assets/common/* assets/temp-complete/ "]))

  .then(function(){
    var output = fs.createWriteStream('assets/complete-f6.zip');
      var archive = archiver('zip'); //straight from the npm archiver docs
      output.on('close', function () {
        debug("Finished building complete zip")
        childProcess.execFileAsync(process.env.SHELL,['-c', "mv assets/complete-f6.zip public/assets/complete-f6.zip"])
        rimraf('assets/temp-complete', function(){
        })
      });

      //error almost always means the src path didn't exist
      archive.on('error', function(err){
      })
    archive.pipe(output);
    archive.directory('assets/temp-complete', 'foundation-6').finalize();
  })
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/essential/{css,js,img}"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/temp-essential/gulp"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r scss ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r js ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r assets/common/* assets/essential']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp gulp/{javascript.js,deploy.js,sass.js} ../node-foundation-customizer/app/assets/temp-essential/gulp'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp gulpfile.js ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r assets ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'sed -i \'1i @import "settings/settings";\' assets/temp-essential/scss/foundation.scss']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "sed -i \"s|@import '../node_modules/motion-ui/src/motion-ui';||g\" assets/temp-essential/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "sed -i 's|@include motion-ui-transitions;||g' assets/temp-essential/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "sed -i 's|@include motion-ui-animations;||g' assets/temp-essential/scss/foundation.scss"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "sed -i \"s|sass()|sass({includePaths: ['scss']})|g\" assets/temp-essential/gulp/sass.js"]))
  .then(function(){
    var essential=[ 'sed -i "s|\'scss\',|\'scss\'|g" assets/temp-essential/gulp/sass.js','sed -i "s|\'node_modules/motion-ui/src\'||g" assets/temp-essential/gulp/sass.js',
    'sed -i "s|\'node_modules/jquery/dist/jquery.js\',|\'node_modules/jquery/dist/jquery.js\'|g" assets/temp-essential/gulp/javascript.js',
    "sed -i \"s|@import '../node_modules/motion-ui/src/motion-ui';||g\" assets/temp-essential/scss/foundation.scss",
    "sed -i \"s|@include motion-ui-transitions;||g\" assets/temp-essential/scss/foundation.scss",
    "sed -i \"s|@include motion-ui-animations;||g\" assets/temp-essential/scss/foundation.scss",
    'sed -i "s|\'node_modules/motion-ui/dist/motion-ui.js\',||g" assets/temp-essential/gulp/javascript.js',
    'sed -i "s|\'node_modules/what-input/what-input.js\'||g" assets/temp-essential/gulp/javascript.js',
    'sed -i "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/deploy.js','sed -i "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/sass.js','sed -i "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/javascript.js','sed -i "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulpfile.js','sed -i "s|require(\''+__dirname+'/../../f6/node_modules/fs|require(\'fs|g" assets/temp-essential/gulp/sass.js','sed -i "s|require(\''+__dirname+'/../../f6/node_modules/gulp|require(\'../../node_modules/gulp|g" assets/temp-essential/gulpfile.js','sed -i "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/deploy.js',"sed -i \"s|var exec = require('"+process.cwd()+"/../../f6/node_modules/child_process').execSync;||g\" assets/temp-essential/gulp/deploy.js",'sed -i "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/javascript.js','sed -i "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/sass.js','sed -i "s|./_build/assets/css/foundation.css|../essential/css/foundation.css|g" assets/temp-essential/gulp/deploy.js','sed -i "s|_build/assets/css|../essential/css|g" assets/temp-essential/gulp/sass.js','sed -i "s|_build/assets/js|../essential/js|g" assets/temp-essential/gulp/javascript.js','sed -i "s|./_build/assets/css|../essential/css|g" assets/temp-essential/gulp/deploy.js','sed -i "s|./_build/assets/js|../essential/js|g" assets/temp-essential/gulp/deploy.js','sed -i "s|_build/assets/js/foundation.js|../essential/js/foundation.js|g" assets/temp-essential/gulp/deploy.js','sed -i "s|@import \'components/joyride\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/accordion-menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|requireDir(\'./gulp\');||g" assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/deploy.js >> assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/sass.js >> assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/javascript.js >> assets/temp-essential/gulpfile.js','sed -i "s|@import \'forms/forms\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/accordion\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/badge\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/breadcrumbs\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/button-group\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/callout\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/close-button\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/drilldown\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/dropdown\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/dropdown-menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/flex-video\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/label\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/media-object\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/off-canvas\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/orbit\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/pagination\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/progress-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/slider\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/sticky\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/switch\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/table\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/tabs\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/thumbnail\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/title-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/tooltip\';||g" assets/temp-essential/scss/foundation.scss','sed -i "s|@import \'components/top-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-forms;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-visibility-classes;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-float-classes;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-accordion;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-badge;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-breadcrumbs;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-button-group;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-callout;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-close-button;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-drilldown-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-dropdown;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-dropdown-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-flex-video;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-label;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-media-object;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-off-canvas;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-orbit;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-pagination;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-progress-bar;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-slider;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-sticky;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-switch;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-table;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-tabs;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-thumbnail;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-title-bar;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-tooltip;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-accordion-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'s/@include foundation-top-bar;//g\' assets/temp-essential/scss/foundation.scss','rm assets/temp-essential/js/foundation.accordion.js','rm assets/temp-essential/js/foundation.dropdown.js','rm assets/temp-essential/js/foundation.dropdownMenu.js','rm assets/temp-essential/js/foundation.offcanvas.js','rm assets/temp-essential/js/foundation.orbit.js','rm assets/temp-essential/js/foundation.slider.js','rm assets/temp-essential/js/foundation.sticky.js','rm assets/temp-essential/js/foundation.tabs.js','rm assets/temp-essential/js/foundation.tooltip.js','rm assets/temp-essential/js/foundation.interchange.js','rm assets/temp-essential/js/foundation.magellan.js','rm assets/temp-essential/js/foundation.responsiveMenu.js','rm assets/temp-essential/js/foundation.responsiveToggle.js','rm assets/temp-essential/js/foundation.toggler.js','rm assets/temp-essential/js/foundation.abide.js','rm assets/temp-essential/js/foundation.equalizer.js'].join(' && ')


    var fork = childProcess.spawn(process.env.SHELL, ['-c',essential]);
    fork.stdout.on('data', function (data) {
        debug(data.toString());
    });
    fork.stderr.on('data', function (data) {
      debug(data.toString());
    });
    fork.on('close', function(code){
      var forker = childProcess.spawn(process.env.SHELL, ['-c', 'gulp deploy:custom  && rm ../essential/css/foundation-flex* && rm ../essential/css/*.map'], {cwd: 'assets/temp-essential'});
      forker.stdout.on('data', function (data) {

        var output = data.toString().split('\n')
        for(var i=0; i<output.length-1; i++){
        }
      });
      forker.stderr.on('data', function (data) {
        var output = data.toString();
      });
      forker.on('close', function(code){
        var outputer = fs.createWriteStream('assets/essential-f6.zip');
        var archive2 = archiver('zip');
          outputer.on('close', function () {
            debug("Finished building essential zip")
            childProcess.execFileAsync(process.env.SHELL,['-c', "mv assets/essential-f6.zip public/assets/essential-f6.zip"])
            rimraf('assets/temp-essential', function(){
            })
            rimraf('assets/essential', function(){
            })
          });

          //error almost always means the src path didn't exist
          archive2.on('error', function(err){
          })
        archive2.pipe(outputer);
        archive2.directory('assets/essential', 'essential-f6').finalize();
      })

    })
  })
  return;
}
