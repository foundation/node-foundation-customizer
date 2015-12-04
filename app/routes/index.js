
var debug = require('debug')('node-foundation-customizer:server');
var express      = require('express');
var archiver     = require('archiver')
var fs           = require('fs')
var app          = require('../app')
var path = require('path');
var rimraf       = require('rimraf')
var router = express.Router();
var childProcess = require('child_process')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var locked = false;
router.post('/custom-f6', function(req, res, next) {
  var cleanup = function(){
    rimraf('public/assets/custom-f6-'+uniq+'.zip', function(){
    })
    rimraf('assets/custom-f6-'+uniq, function(){
    })
    rimraf('assets/temp-'+uniq, function(){
    })
    delete data;
  }
  var zip = function(){
    var output = fs.createWriteStream('public/assets/custom-f6-'+uniq+'.zip');
      var archive = archiver('zip'); //straight from the npm archiver docs
      output.on('close', function () {
        var file = path.join(__dirname, '../public/assets', 'custom-f6-'+uniq+'.zip')
        res.download(file);
        debug("Finished building custom-" + uniq)
        cleanup();
      });

      //error almost always means the src path didn't exist
      archive.on('error', function(err){
      })
    archive.pipe(output);
    archive.directory('assets/custom-f6-'+uniq, 'custom-f6').finalize();
  }
  var complete = function(){

    var fork = childProcess.spawn(process.env.SHELL, ['-c', 'gulp deploy:custom'], {cwd: 'assets/temp-'+uniq});
    fork.stdout.on('data', function (data) {

      var output = data.toString().split('\n')
      for(var i=0; i<output.length-1; i++){
      }
    });
    fork.stderr.on('data', function (data) {
      var output = data.toString();
    });
    fork.on('close', function(code){
      locked=false;
      zip();
    })
  }
  var data = {}
  data.includes = {
    "grid":"@include foundation-grid;",
    "typography":"@include foundation-typography;",
    "button":"@include foundation-button;",
    "forms":"@include foundation-forms;",
    "visibility_classes":"@include foundation-visibility-classes;",
    "float_classes":"@include foundation-float-classes;",
    "accordion":"@include foundation-accordion;",
    "accordion_menu":"@include foundation-accordion-menu;",
    "badge":"@include foundation-badge;",
    "breadcrumbs":"@include foundation-breadcrumbs;",
    "button_group":"@include foundation-button-group;",
    "callout":"@include foundation-callout;",
    "close_button":"@include foundation-close-button;",
    "drilldown_menu":"@include foundation-drilldown-menu;",
    "dropdown":"@include foundation-dropdown;",
    "dropdown_menu":"@include foundation-dropdown-menu;",
    "flex_video":"@include foundation-flex-video;",
    "label":"@include foundation-label;",
    "media_object":"@include foundation-media-object;",
    "menu":"@include foundation-menu;",
    "off-canvas":"@include foundation-off-canvas;",
    "orbit":"@include foundation-orbit;",
    "pagination":"@include foundation-pagination;",
    "progress_bar":"@include foundation-progress-bar;",
    "slider":"@include foundation-slider;",
    "sticky":"@include foundation-sticky;",
    "reveal":"@include foundation-reveal;",
    "switch":"@include foundation-switch;",
    "table":"@include foundation-table;",
    "tabs":"@include foundation-tabs;",
    "thumbnail":"@include foundation-thumbnail;",
    "title_bar":"@include foundation-title-bar;",
    "tooltip":"@include foundation-tooltip;",
    "top_bar":"@include foundation-top-bar;"
  }
  data.components = [
    "grid",
    "flex_grid",
    "typography",
    "button",
    "forms",
    "visibility_classes",
    "float_classes",
    "accordion",
    "accordion_menu",
    "badge",
    "breadcrumbs",
    "button_group",
    "callout",
    "close_button",
    "drilldown_menu",
    "dropdown",
    "dropdown_menu",
    "flex_video",
    "label",
    "media_object",
    "menu",
    "off-canvas",
    "orbit",
    "pagination",
    "progress_bar",
    "slider",
    "sticky",
    "reveal",
    "switch",
    "table",
    "tabs",
    "thumbnail",
    "title_bar",
    "tooltip",
    "top_bar",
    "motion_ui",
    "interchange",
    "magellan",
    "responsive_menu",
    "responsive_toggle",
    "toggler",
    "abide",
    "equalizer"
  ]
  data.js={
    "accordion":"foundation.accordion.js",
    "accordion_menu":"foundation.accordionMenu.js",
    "drilldown":"foundation.drilldown.js",
    "dropdown":"foundation.dropdown.js",
    "dropdown_menu":"foundation.dropdownMenu.js",
    "off-canvas":"foundation.offcanvas.js",
    "orbit":"foundation.orbit.js",
    "reveal":"foundation.reveal.js",
    "slider":"foundation.slider.js",
    "sticky":"foundation.sticky.js",
    "tabs":"foundation.tabs.js",
    "tooltip":"foundation.tooltip.js",
    "interchange":"foundation.interchange.js",
    "magellan":"foundation.magellan.js",
    "responsive_menu":"foundation.responsiveMenu.js",
    "responsive_toggle":"foundation.responsiveToggle.js",
    "toggler":"foundation.toggler.js",
    "abide":"foundation.abide.js",
    "equalizer":"foundation.equalizer.js"
  }
  data.imports={
    "grid":"@import 'grid/grid';",
    "typography":"@import 'typography/typography';",
    "forms":"@import 'forms/forms';",
    "visibility_classes":"@import 'components/visibility';",
    "float_classes":"@import 'components/float';",
    "button":"@import 'components/button';",
    "button_group":"@import 'components/button-group';",
    "accordion_menu":"@import 'components/accordion-menu';",
    "accordion":"@import 'components/accordion';",
    "badge":"@import 'components/badge';",
    "breadcrumbs":"@import 'components/breadcrumbs';",
    "callout":"@import 'components/callout';",
    "close_button":"@import 'components/close-button';",
    "drilldown_menu":"@import 'components/drilldown';",
    "dropdown_menu":"@import 'components/dropdown-menu';",
    "dropdown":"@import 'components/dropdown';",
    "flex_video":"@import 'components/flex-video';",
    "label":"@import 'components/label';",
    "media_object":"@import 'components/media-object';",
    "menu":"@import 'components/menu';",
    "off-canvas":"@import 'components/off-canvas';",
    "orbit":"@import 'components/orbit';",
    "pagination":"@import 'components/pagination';",
    "progress_bar":"@import 'components/progress-bar';",
    "reveal":"@import 'components/reveal';",
    "slider":"@import 'components/slider';",
    "sticky":"@import 'components/sticky';",
    "switch":"@import 'components/switch';",
    "table":"@import 'components/table';",
    "tabs":"@import 'components/tabs';",
    "title_bar":"@import 'components/title-bar';",
    "top_bar":"@import 'components/top-bar';",
    "thumbnail":"@import 'components/thumbnail';",
    "joyride":"@import 'components/joyride';",
    "tooltip":"@import 'components/tooltip';"
  }
  data.settings= [
    "column-count",
    "column-gutter",
    "max-width",
    "primary-color",
    "secondary-color",
    "success-color",
    "alert-color",
    "body-font-color",
    "header-font-color",
    "global-radius",
    "text-direction"
  ]
  data.settingsLocators= {
    "column-count":"$grid-column-count: 12;",
    "column-gutter":"$grid-column-gutter: 1.875rem / 2;",
    "max-width":"$global-width: rem-calc(1200);",
    "primary-color":"$primary-color: #2199e8;",
    "secondary-color":"$secondary-color: #777;",
    "success-color":"$success-color: #3adb76;",
    "alert-color":"$alert-color: #ec5840;",
    "body-font-color":"$body-font-color: $black;",
    "header-font-color":"$header-color: inherit;",
    "global-radius":"$global-radius: 0;",
    "text-direction":"$global-text-direction: ltr;"
  }
  data.settingsText= {
    "column-count":"$grid-column-count: ",
    "column-gutter":"$grid-column-gutter: ",
    "max-width":"$global-width: ",
    "primary-color":"$primary-color: ",
    "secondary-color":"$secondary-color: ",
    "success-color":"$success-color: ",
    "alert-color":"$alert-color: ",
    "body-font-color":"$body-font-color: ",
    "header-font-color":"$header-color: ",
    "global-radius":"$global-radius: ",
    "text-direction":"$global-text-direction: "
  }
  data.settingsPrefix= {
    "column-count":"",
    "column-gutter":"",
    "max-width":"",
    "primary-color":"#",
    "secondary-color":"#",
    "success-color":"#",
    "alert-color":"#",
    "body-font-color":"#",
    "header-font-color":"#",
    "global-radius":"",
    "text-direction":""
  }
  data.settingsSuffix= {
    "column-count":"",
    "column-gutter":"rem",
    "max-width":"rem",
    "primary-color":"",
    "secondary-color":"",
    "success-color":"",
    "alert-color":"",
    "body-font-color":"",
    "header-font-color":"",
    "global-radius":"px",
    "text-direction":""
  }
  var unimport=[];
  var uninclude=[];
  var unjs=[];
  var options={cwd:"../../f6/"}
  var uniq=Math.random().toString(36).substr(2, 5)
  debug(uniq)
  var commands=[
    "sed -i \"s|require('|require('"+process.cwd()+"/../../f6/node_modules/|g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|require('|require('"+process.cwd()+"/../../f6/node_modules/|g\" assets/temp-"+uniq+"/gulp/sass.js",
    "sed -i \"s|require('|require('"+process.cwd()+"/../../f6/node_modules/|g\" assets/temp-"+uniq+"/gulp/javascript.js",
    "sed -i \"s|require('|require('"+process.cwd()+"/../../f6/node_modules/|g\" assets/temp-"+uniq+"/gulpfile.js",
    "sed -i \"s|require('"+process.cwd()+"/../../f6/node_modules/fs|require('fs|g\" assets/temp-"+uniq+"/gulp/sass.js",
    "sed -i \"s|require('"+process.cwd()+"/../../f6/node_modules/gulp|require('../../node_modules/gulp|g\" assets/temp-"+uniq+"/gulpfile.js",
    "sed -i \"s|var gulp = require('"+process.cwd()+"/../../f6/node_modules/gulp');||g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|var gulp = require('"+process.cwd()+"/../../f6/node_modules/gulp');||g\" assets/temp-"+uniq+"/gulp/javascript.js",
    "sed -i \"s|var gulp = require('"+process.cwd()+"/../../f6/node_modules/gulp');||g\" assets/temp-"+uniq+"/gulp/sass.js",
    "sed -i \"s|./_build/assets/css/foundation.css|../custom-f6-"+uniq+"/css/foundation.css|g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|_build/assets/css|../custom-f6-"+uniq+"/css|g\" assets/temp-"+uniq+"/gulp/sass.js",
    "sed -i \"s|_build/assets/js|../custom-f6-"+uniq+"/js|g\" assets/temp-"+uniq+"/gulp/javascript.js",
    'sed -i "s|\'node_modules/jquery/dist/jquery.js\',|\'node_modules/jquery/dist/jquery.js\'|g" assets/temp-'+uniq+'/gulp/javascript.js',
    'sed -i "s|\'node_modules/motion-ui/dist/motion-ui.js\',||g" assets/temp-'+uniq+'/gulp/javascript.js',
    'sed -i "s|\'node_modules/what-input/what-input.js\'||g" assets/temp-'+uniq+'/gulp/javascript.js',
    "sed -i \"s|./_build/assets/css|../custom-f6-"+uniq+"/css|g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|./_build/assets/js|../custom-f6-"+uniq+"/js|g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|_build/assets/js/foundation.js|../custom-f6-"+uniq+"/js/foundation.js|g\" assets/temp-"+uniq+"/gulp/deploy.js",
    "sed -i \"s|@import 'components/joyride';||g\" assets/temp-"+uniq+"/scss/foundation.scss",
    "sed -i \"s|requireDir('./gulp');||g\" assets/temp-"+uniq+"/gulpfile.js",
    "cat assets/temp-"+uniq+"/gulp/deploy.js >> assets/temp-"+uniq+"/gulpfile.js",
    "cat assets/temp-"+uniq+"/gulp/sass.js >> assets/temp-"+uniq+"/gulpfile.js",
    "cat assets/temp-"+uniq+"/gulp/javascript.js >> assets/temp-"+uniq+"/gulpfile.js"
  ];
  var wait = function(){
    debug("WAITING")
    if(app.gitlock) setTimeout(wait,1000);
    else go();
  }
  var go = function() {
    debug("GO")
    childProcess.execFileSync(process.env.SHELL,['-c', "mkdir -p assets/{temp-"+uniq+"/gulp,custom-f6-"+uniq+"/{css,js}}"])
    app.gitlock=true;
    debug("Locked f6 folder for copy.")
    childProcess.execFileSync(process.env.SHELL,['-c', 'cp -r scss ../node-foundation-customizer/app/assets/temp-'+uniq], {cwd: '../../f6'})
    childProcess.execFileSync(process.env.SHELL,['-c', 'cp -r js ../node-foundation-customizer/app/assets/temp-'+uniq], {cwd: '../../f6'})
    childProcess.execFileSync(process.env.SHELL,['-c', 'cp -r assets/common/* assets/custom-f6-'+uniq])
    childProcess.execFileSync(process.env.SHELL,['-c', 'cp gulp/{javascript.js,deploy.js,sass.js} ../node-foundation-customizer/app/assets/temp-'+uniq+'/gulp'], {cwd: '../../f6'})
    childProcess.execFileSync(process.env.SHELL,['-c', 'cp {foundation-sites.scss,gulpfile.js} ../node-foundation-customizer/app/assets/temp-'+uniq], {cwd: '../../f6'})
    debug("Unlocked f6 folder. Copy complete.")
    app.gitlock=false;
    childProcess.execFileSync(process.env.SHELL,['-c', 'sed -i \'1i @import "settings/settings";\' assets/temp-'+uniq+'/scss/foundation.scss'])
    if(req.body['components[]'].indexOf('motion_ui') < 0){
      commands.unshift("sed -i \"s|'node_modules/motion-ui/src'||g\" assets/temp-"+uniq+"/gulp/sass.js")
      commands.unshift("sed -i \"s|'scss',|'scss'|g\" assets/temp-"+uniq+"/gulp/sass.js")
    }
    else{
      commands.push("sed -i \"s|node_modules/motion-ui/src|../../f6/node_modules/motion-ui/src|g\" assets/temp-"+uniq+"/gulp/sass.js")
      commands.push("echo \"@import '../../../../../f6/node_modules/motion-ui/src/motion-ui';\" >> assets/temp-"+uniq+"/scss/foundation.scss")
      commands.push("echo '@include motion-ui-transitions;' >> assets/temp-"+uniq+"/scss/foundation.scss")
      commands.push("echo '@include motion-ui-animations;' >> assets/temp-"+uniq+"/scss/foundation.scss")
    }
    debug("DEBUG: "+req.body['components[]'])
    //if someone selects grid and flex grid, default to regular grid
    if(typeof(req.body['components[]']) !== 'string' && req.body['components[]'].indexOf('grid') >= 0 && req.body['components[]'].indexOf('flex_grid') >= 0){
      delete req.body['components[]'][req.body['components[]'].indexOf('flex_grid')]
    }
    // here we know only the flex grid is selected
    else if(req.body['components[]'] == 'flex_grid' || req.body['components[]'].indexOf('flex_grid') >= 0){
      delete data.imports['grid'];//deleting a component means we keep it
      delete data.includes['grid'];//deleting a component means we keep it
      delete data.js['grid']
      delete data.components[data.components.indexOf('grid')]
      commands.unshift("sed -i 's/@include foundation-grid;/@include foundation-flex-grid;/g' assets/temp-"+uniq+"/scss/foundation.scss")
    }
    //make sure there is more than one item before we iterate
    if(typeof(req.body['components[]']) == 'object'){
      req.body['components[]'].forEach(function(element){
        delete data.imports[element];//deleting a component means we keep it
        delete data.includes[element];//deleting a component means we keep it
        delete data.js[element]
        delete data.components[data.components.indexOf(element)]
      })
    }
    //treat our body as a string in this situation
    else if(typeof(req.body['components[]']) == 'string' && req.body['components[]'] !== 'flex_grid'){
      delete data.imports[req.body['components[]']];//deleting a component means we keep it
      delete data.includes[req.body['components[]']];//deleting a component means we keep it
      delete data.js[req.body['components[]']]
      delete data.components[data.components.indexOf(req.body['components'])]
    }

    data.components=data.components.filter(function(e){return e})
    debug(data.components)
    data.components.forEach(function(element){
      unimport.push(data.imports[element])
      uninclude.push(data.includes[element])
      unjs.push(data.js[element])
    })
    unimport=unimport.filter(function(e){return e})
    unimport.forEach(function(element, index){
      commands.push("sed -i \"s|"+element+"||g\" assets/temp-"+uniq+"/scss/foundation.scss");
    })
    uninclude=uninclude.filter(function(e){return e})

    uninclude.forEach(function(element, index){
      commands.push("sed -i 's/"+element+"//g' assets/temp-"+uniq+"/scss/foundation.scss");
    })
    unjs=unjs.filter(function(e){return e})
    unjs.forEach(function(element, index){
      commands.push("rm assets/temp-"+uniq+"/js/"+element);
    })
    data.settings.forEach(function(element, index){
      if(req.body["scss_settings["+element+"]"] == 'rtl'){
        commands.push("sed -i 's|<html class=\"no-js\" lang=\"en\">|<html dir=\"rtl\" class=\"no-js\" lang=\"en\">|g' assets/custom-f6-"+uniq+"/index.html");
      }
      commands.push("sed -i 's|"+data.settingsLocators[element]+"|"+data.settingsText[element]+data.settingsPrefix[element]+req.body["scss_settings["+element+"]"]+data.settingsSuffix[element]+";|g' assets/temp-"+uniq+"/scss/settings/_settings.scss");
    })
    commands.push("sed -i 's|##|#|g' assets/temp-"+uniq+"/scss/settings/_settings.scss")
    commands.push("sed -i 's|remrem|rem|g' assets/temp-"+uniq+"/scss/settings/_settings.scss")
    commands.push("sed -i 's|pxrem|px|g' assets/temp-"+uniq+"/scss/settings/_settings.scss")
    commands.push("sed -i 's|pxpx|px|g' assets/temp-"+uniq+"/scss/settings/_settings.scss")
    commands.push("sed -i 's|@import '../node_modules/motion-ui/src/motion-ui';||g'")
    commands.push("sed -i 's|@include motion-ui-transitions;||g'")
    commands.push("sed -i 's|@include motion-ui-animations;||g'")

    debug(process.cwd());
    debug(commands.join(' && '));
    var fork = childProcess.spawn(process.env.SHELL, ['-c', commands.join(' && ')]);
    fork.stdout.on('data', function (data) {
        debug(data.toString());
    });
    fork.stderr.on('data', function (data) {
      debug(data.toString());
    });
    fork.on('close', function(code){
      complete();
    })
  }
  if(app.gitlock) wait();
  else go();
});

module.exports = router;
