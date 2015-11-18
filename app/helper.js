var archiver     = require('archiver')
var fs       = require('fs');
var rimraf       = require('rimraf')
var debug = require('debug')('node-foundation-customizer:server');
var app = require('./app')
var Promise = require("bluebird");
var childProcess = Promise.promisifyAll(require('child_process'));
exports.createCompleteAndEssential=function(){
  childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/temp-complete/{css,js}"])
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "gulp deploy:custom"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./_build/assets/css/*.css ../node-foundation-customizer/app/assets/temp-complete/css"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./_build/assets/js/*.js ../node-foundation-customizer/app/assets/temp-complete/js"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./bower_components/jquery/dist/jquery.min.js ../node-foundation-customizer/app/assets/temp-complete/js"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp ./bower_components/jquery/dist/jquery.js ../node-foundation-customizer/app/assets/temp-complete/js"], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "cp -r assets/common/* assets/temp-complete/"]))
  .then(function(){
    var output = fs.createWriteStream('public/assets/complete-f6.zip');
      var archive = archiver('zip'); //straight from the npm archiver docs
      output.on('close', function () {
        debug("Finished building complete zip")
        rimraf('assets/temp-complete', function(){
        })
      });

      //error almost always means the src path didn't exist
      archive.on('error', function(err){
      })
    archive.pipe(output);
    archive.directory('assets/temp-complete', 'foundation-6').finalize();
  })
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/essential/{css,js}"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', "mkdir -p assets/temp-essential/gulp"]))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r scss ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r js ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp -r assets/common/* assets/essential']))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp gulp/{javascript.js,deploy.js,sass.js} ../node-foundation-customizer/app/assets/temp-essential/gulp'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'cp {foundation-sites.scss,gulpfile.js} ../node-foundation-customizer/app/assets/temp-essential'], {cwd: '../../f6'}))
  .then(childProcess.execFileAsync(process.env.SHELL,['-c', 'echo \'@import "settings"\' >> assets/temp-essential'+'/scss/foundation.scss']))
  .then(function(){
    var essential=[ 'sed -i \'\' -e "s|\'scss\',|\'scss\'|g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|\'node_modules/motion-ui/src\'||g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/deploy.js','sed -i \'\' -e "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulp/javascript.js','sed -i \'\' -e "s|require(\'|require(\''+__dirname+'/../../f6/node_modules/|g" assets/temp-essential/gulpfile.js','sed -i \'\' -e "s|require(\''+__dirname+'/../../f6/node_modules/fs|require(\'fs|g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|require(\''+__dirname+'/../../f6/node_modules/gulp|require(\'../../node_modules/gulp|g" assets/temp-essential/gulpfile.js','sed -i \'\' -e "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/deploy.js','sed -i \'\' -e "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/javascript.js','sed -i \'\' -e "s|var gulp = require(\''+__dirname+'/../../f6/node_modules/gulp\');||g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|./_build/assets/css/foundation.css|../essential/css/foundation.css|g" assets/temp-essential/gulp/deploy.js','cp ../../f6/bower_components/jquery/dist/jquery.js ./assets/essential/js','sed -i \'\' -e "s|_build/assets/css|../essential/css|g" assets/temp-essential/gulp/sass.js','sed -i \'\' -e "s|_build/assets/js|../essential/js|g" assets/temp-essential/gulp/javascript.js','sed -i \'\' -e "s|./_build/assets/css|../essential/css|g" assets/temp-essential/gulp/deploy.js','sed -i \'\' -e "s|./_build/assets/js|../essential/js|g" assets/temp-essential/gulp/deploy.js','cp ../../f6/bower_components/jquery/dist/jquery.min.js ./assets/essential/js','sed -i \'\' -e "s|_build/assets/js/foundation.js|../essential/js/foundation.js|g" assets/temp-essential/gulp/deploy.js','sed -i \'\' -e "s|@import \'components/joyride\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/accordion-menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|requireDir(\'./gulp\');||g" assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/deploy.js >> assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/sass.js >> assets/temp-essential/gulpfile.js','cat assets/temp-essential/gulp/javascript.js >> assets/temp-essential/gulpfile.js','sed -i \'\' -e "s|@import \'forms/forms\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/accordion\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/badge\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/breadcrumbs\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/button-group\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/callout\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/close-button\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/drilldown\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/dropdown\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/dropdown-menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/flex-video\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/label\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/media-object\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/menu\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/off-canvas\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/orbit\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/pagination\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/progress-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/slider\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/sticky\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/switch\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/table\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/tabs\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/thumbnail\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/title-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/tooltip\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e "s|@import \'components/top-bar\';||g" assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-forms;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-visibility-classes;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-float-classes;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-accordion;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-badge;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-breadcrumbs;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-button-group;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-callout;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-close-button;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-drilldown-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-dropdown;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-dropdown-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-flex-video;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-label;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-media-object;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-menu;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-off-canvas;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-orbit;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-pagination;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-progress-bar;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-slider;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-sticky;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-switch;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-table;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-tabs;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-thumbnail;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-title-bar;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-tooltip;//g\' assets/temp-essential/scss/foundation.scss','sed -i \'\' -e \'s/@include foundation-top-bar;//g\' assets/temp-essential/scss/foundation.scss','rm assets/temp-essential/js/foundation.accordion.js','rm assets/temp-essential/js/foundation.dropdown.js','rm assets/temp-essential/js/foundation.dropdownMenu.js','rm assets/temp-essential/js/foundation.offcanvas.js','rm assets/temp-essential/js/foundation.orbit.js','rm assets/temp-essential/js/foundation.slider.js','rm assets/temp-essential/js/foundation.sticky.js','rm assets/temp-essential/js/foundation.tabs.js','rm assets/temp-essential/js/foundation.tooltip.js','rm assets/temp-essential/js/foundation.interchange.js','rm assets/temp-essential/js/foundation.magellan.js','rm assets/temp-essential/js/foundation.responsiveMenu.js','rm assets/temp-essential/js/foundation.responsiveToggle.js','rm assets/temp-essential/js/foundation.toggler.js','rm assets/temp-essential/js/foundation.abide.js','rm assets/temp-essential/js/foundation.equalizer.js'].join(' && ')
    var fork = childProcess.spawn(process.env.SHELL, ['-c',essential]);
    fork.stdout.on('data', function (data) {
        debug(data.toString());
    });
    fork.stderr.on('data', function (data) {
      debug(data.toString());
    });
    fork.on('close', function(code){
      var forker = childProcess.spawn(process.env.SHELL, ['-c', 'gulp sass:foundation && gulp javascript:foundation && gulp deploy:custom'], {cwd: 'assets/temp-essential'});
      forker.stdout.on('data', function (data) {

        var output = data.toString().split('\n')
        for(var i=0; i<output.length-1; i++){
        }
      });
      forker.stderr.on('data', function (data) {
        var output = data.toString();
      });
      forker.on('close', function(code){
        var outputer = fs.createWriteStream('public/assets/essential-f6.zip');
        var archive2 = archiver('zip');
          outputer.on('close', function () {
            debug("Finished building essential zip")
            rimraf('assets/temp-essential', function(){
            })
            rimraf('assets/essential', function(){
            })
            var wait = function(){
              console.log("Waiting for folder lock on foundation-sites-6 to be released...")
              if(app.gitlock) setTimeout(wait,1000);
              else go();
            }

            var go = function(){


              app.gitlock=true;
              debug("Locked f6 folder to prepare for update.")
              var forkeroo=childProcess.spawn(process.env.SHELL,['-c', 'rsync -av --progress ../../foundation-sites-6/* ../../f6 --exclude .git'])
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
              })
            }
            if(app.gitlock) wait();
            else go();

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
