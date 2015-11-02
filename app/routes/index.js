

var express      = require('express');
var archiver     = require('archiver')
var fs           = require('fs')
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
    delete data;
  }
  var zip = function(){
    var output = fs.createWriteStream('public/assets/custom-f6-'+uniq+'.zip');
      var archive = archiver('zip'); //straight from the npm archiver docs
      output.on('close', function () {
        res.sendfile('custom-f6-'+uniq+'.zip', {root: 'public/assets'}, cleanup)
      });

      //error almost always means the src path didn't exist
      archive.on('error', function(err){
      })
    archive.pipe(output);
    archive.directory('assets/custom-f6-'+uniq, 'custom-f6-'+uniq).finalize();
  }
  var complete = function(){

    var fork = childProcess.spawn(process.env.SHELL, ['-c', 'gulp sass:foundation && gulp javascript:foundation && gulp deploy'], {cwd: '../../foundation-sites-6'});
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
    "global-styles":"@include foundation-global-styles;",
    "grid":"@include foundation-grid;",
    "typography":"@include foundation-typography;",
    "button":"@include foundation-button;",
    "forms":"@include foundation-forms;",
    "visibility_classes":"@include foundation-visibility-classes;",
    "float_classes":"@include foundation-float-classes;",
    "accordion":"@include foundation-accordion;",
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
    "global-styles",
    "grid",
    "typography",
    "button",
    "forms",
    "visibility_classes",
    "float_classes",
    "accordion",
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
    "dropdown_menu":"foundation.dropdown-menu.js",
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
    "grid":"'grid/grid',",
    "global-styles":"@import 'global';",
    "typography":"'typography/typography',",
    "forms":"'forms/forms',",
    "visibility":"'components/visibility',",
    "float":"'components/float',",
    "button":"'components/button',",
    "button_group":"'components/button-group',",
    "accordion_menu":"'components/accordion-menu',",
    "accordion":"'components/accordion',",
    "badge":"'components/badge',",
    "breadcrumbs":"'components/breadcrumbs',",
    "callout":"'components/callout',",
    "close_button":"'components/close-button',",
    "drilldown_menu":"'components/drilldown',",
    "dropdown_menu":"'components/dropdown-menu',",
    "dropdown":"'components/dropdown',",
    "flex_video":"'components/flex-video',",
    "label":"'components/label',",
    "media_object":"'components/media-object',",
    "menu":"'components/menu',",
    "off-canvas":"'components/off-canvas',",
    "orbit":"'components/orbit',",
    "pagination":"'components/pagination',",
    "progress_bar":"'components/progress-bar',",
    "reveal":"'components/reveal',",
    "slider":"'components/slider',",
    "sticky":"'components/sticky',",
    "switch":"'components/switch',",
    "table":"'components/table',",
    "tabs":"'components/tabs',",
    "title_bar":"'components/title-bar',",
    "top_bar":"'components/top-bar',",
    "thumbnail":"'components/thumbnail',",
    "tooltip":"'components/tooltip';"
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
    "column-count":"// $grid-column-count: 12;",
    "column-gutter":"// $grid-column-gutter: 1.875rem / 2;",
    "max-width":"// $global-width: rem-calc(1200);",
    "primary-color":"// $primary-color: #2199e8;",
    "secondary-color":"// $secondary-color: #777;",
    "success-color":"// $success-color: #3adb76;",
    "alert-color":"// $alert-color: #ec5840;",
    "body-font-color":"// $body-font-color: $black;",
    "header-font-color":"// $header-color: inherit;",
    "global-radius":"// $global-radius: 3px;",
    "text-direction":"// $text-direction: ltr;"
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
    "text-direction":"$text-direction: "
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
    "global-radius":"rem",
    "text-direction":""
  }
  var unimport=[];
  var uninclude=[];
  var unjs=[];
  var options={cwd:"../../foundation-sites-6/"}
  var uniq=Math.random().toString(36).substr(2, 5)
  console.log(uniq)
  var commands=[
    "sed -i '' -e \"s|./_build/assets/css/foundation.css|"+__dirname+"/../assets/custom-f6-"+uniq+"/foundation.css|g\" ../../foundation-sites-6/gulp/deploy.js",
    "cp ../../foundation-sites-6/bower_components/jquery/dist/jquery.js ./assets/custom-f6-"+uniq,
    "sed -i '' -e \"s|_build/assets/css|"+__dirname+"/../assets/custom-f6-"+uniq+"|g\" ../../foundation-sites-6/gulp/sass.js",
    "sed -i '' -e \"s|_build/assets/js|"+__dirname+"/../assets/custom-f6-"+uniq+"|g\" ../../foundation-sites-6/gulp/javascript.js",
    "sed -i '' -e \"s|./dist|"+__dirname+"/../assets/custom-f6-"+uniq+"|g\" ../../foundation-sites-6/gulp/deploy.js",
    "cp ../../foundation-sites-6/bower_components/jquery/dist/jquery.min.js ./assets/custom-f6-"+uniq,
    "sed -i '' -e \"s|_build/assets/js/foundation.js|"+__dirname+"/../assets/custom-f6-"+uniq+"/foundation.js|g\" ../../foundation-sites-6/gulp/deploy.js"
  ];
  var wait = function(){
    console.log("WAITING")
    if(locked) setTimeout(wait,1000);
    else go();
  }
  var go = function() {
    console.log("GO")
    locked=true;
    console.log(childProcess.execFileSync(process.env.SHELL,['-c', 'git pull'],options).toString())
    childProcess.execFileSync(process.env.SHELL,['-c', "mkdir assets/custom-f6-"+uniq])
    childProcess.execFileSync(process.env.SHELL,['-c', 'git reset --hard'], {cwd: '../../foundation-sites-6'})
    childProcess.execFileSync(process.env.SHELL,['-c', 'echo \'@import "settings"\' >> scss/foundation.scss'], {cwd: '../../foundation-sites-6'})
    if(req.body['components[]'].indexOf('motion_ui') < 0){
      commands.push("sed -i '' -e \"s|'node_modules/motion-ui/src'||g\" ../../foundation-sites-6/gulp/sass.js")
      commands.unshift("sed -i '' -e \"s|'scss0',|'scss'|g\" ../../foundation-sites-6/gulp/sass.js")
    }
    else{
      commands.push("cat ../../foundation-sites-6/node_modules/motion-ui/dist/motion-ui.js > ../../foundation-sites-6/js/motion-ui.js")
    }
    req.body['components[]'].forEach(function(element){
      delete data.imports[element];//deleting a component means we keep it
      delete data.includes[element];//deleting a component means we keep it
      delete data.js[element]
      delete data.components[data.components.indexOf(element)]
    })
    data.components=data.components.filter(function(e){return e})
    console.log(data.components)
    data.components.forEach(function(element){
      if(element =='tooltip') commands.push("sed -i '' -e \"s|thumbnail',|thumbnail';|g\" ../../foundation-sites-6/scss/foundation.scss")
      unimport.push(data.imports[element])
      uninclude.push(data.includes[element])
      unjs.push(data.js[element])
    })
    unimport=unimport.filter(function(e){return e})
    unimport.forEach(function(element){
      commands.push("sed -i '' -e \"s|"+element+"||g\" ../../foundation-sites-6/scss/foundation.scss");
    })
    uninclude=uninclude.filter(function(e){return e})

    uninclude.forEach(function(element){
      commands.push("sed -i '' -e 's/"+element+"//g' ../../foundation-sites-6/scss/foundation.scss");
    })
    unjs=unjs.filter(function(e){return e})
    unjs.forEach(function(element){
      commands.push("rm ../../foundation-sites-6/js/"+element);
    })
    data.settings.forEach(function(element){
      commands.push("sed -i '' -e 's|"+data.settingsLocators[element]+"|"+data.settingsText[element]+data.settingsPrefix[element]+req.body["scss_settings["+element+"]"]+data.settingsSuffix[element]+";|g' ../../foundation-sites-6/scss/_settings.scss");
    })
    var locks=[];
    commands.forEach(function(element, index){
      locks[index] = false;
      var fork = childProcess.spawn(process.env.SHELL, ['-c', element]);
      fork.stdout.on('data', function (data) {

        var output = data.toString().split('\n')
        for(var i=0; i<output.length-1; i++){
          console.log(output[i]);
        }
      });
      fork.stderr.on('data', function (data) {
        var output = data.toString();
        console.log(output);
      });
      fork.on('close', function(code){
        locks[index]=true;
        if(locks.length == commands.length && locks.indexOf(false) < 0){
          complete();
        }
      })
    })
  }
  if(locked) wait();
  else go();
});

module.exports = router;
