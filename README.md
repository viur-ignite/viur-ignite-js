[![npm version](https://badge.fury.io/js/viur-ignite-js.svg)](https://badge.fury.io/js/viur-ignite-js)
[![Dependency Status](https://david-dm.org/viur-ignite/viur-ignite-js.svg)](https://david-dm.org/viur-ignite/viur-ignite-js)
[![GitHub license](https://img.shields.io/badge/license-GPL-blue.svg)](https://raw.githubusercontent.com/viur-ignite/viur-ignite-js/master/LICENSE)

# VIUR Ignite JS

>The ViUR Ignite Framework is the first attempt in building a sturdy foundation for ViUR products and Mausbrand projects.<br>This CSS toolkit is the very core of ViUR Ignite. It is built upon the principles of many CSS guides and frameworks.

VIUR Ignite JS is an extenstion to [VIUR Ignite CSS](https://github.com/viur-ignite/viur-ignite-css). It's a simple JavaScript libary based on jQuery,


## Install
```
$ npm install viur-ignite-js
```

## Usage
```js
const gulp = require('gulp');
const js = require('viur-ignite-js');

gulp.task('init', function() {
  return js.init();
});

gulp.task('default', function() {
  return js.build();
});
```

Run first the init task with ```$ gulp init``` than you can edit the app.js and minfiy the js with ```$ gulp js```


### Be individual
Call the function with an object of options
```js
gulp.task('default', function() {
  return js.build({
    dest: './output/js'
  });
});
```

The Default options are:
```js
src: './sources/js/app.js',
dest: './appengine/static/js'
```

## Contribution guidelines
* Available for use under the GPL-3.0 license

## Who do I talk to?
* [@phneutral](https://github.com/phneutral)
* [@sveneberth](https://github.com/sveneberth)
