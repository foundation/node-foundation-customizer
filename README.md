# Foundation Customizer

This is the [Foundation Customizer](http://foundation.zurb.com/develop/download.html), a custom zip creator for Foundation 6 by [ZURB](http://zurb.com).

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`

## Installing Dependencies

Get it ready to run on your computer
```
git clone git@github.com:zurb/node-foundation-customizer && cd node-foundation-customizer/app
npm install
```

## Launching the customizer

Easy as 1..2..3!
```
npm start
```


## Customizer Overview

User submits custom build -> f6 repo is updated -> backend builds arguments to sed -> files are modified -> gulp build task is executed -> zip file is created with new files -> zip file is returned to user

The files in question are:

1. _settings.scss
2. foundation.scss
3. gulp/deploy.js
4. gulp/sass.js
5. gulp/javascript.js


In Detail:

1. User submits HTTP request containing list of included components
2. Subtract their list from the complete list and get the components they DONT want.
3. Generate sed script to replace any imports or includes in foundation.scss
4. Generate sed script to remove any unwanted js files
5. Replace the destination of the build for each gulpfile.
6. Replace all settings in _settings.scss every time
7. Build the zipfile, and return it to the user
8. Destroy the zipfile, and the custom folder
