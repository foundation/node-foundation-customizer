# Foundation Customizer

This is the [Foundation Customizer](http://foundation.zurb.com/download.html), a frontend for the custom zip creator for Foundation 6 by [ZURB](http://zurb.com).

## Requirements

You'll need the following software installed to get started.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `[sudo] npm install -g gulp bower`

## Installing Dependencies

Get it ready to run on your computer
```
git clone git@github.com:zurb/node-foundation-customizer && cd node-foundation-customizer
npm install

# NOTE:  You can also symlink in an existing foundation-sites repo.
git clone git@github.com:zurb/foundation-sites && cd foundation-sites
npm install && bower install
```

## Launching the customizer

Easy as 1..2..3!
```
npm start
```


## Customizer Overview

1. User submits custom build 
2. customizer compiles settings into a json file
3. customizer looks for existing zipfile (based on md5 hash of settings)
4. if no zipfile exists, customizer passes json file to foundation-sites customizer gulp task
5. zipfile is sent back.

