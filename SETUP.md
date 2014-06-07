Junior Setup
============

This document will show how to setup Junior with the following:

* Browserify
* Ratchet
* LESS
* Bower

This does not cover how to integrate these technologies into your application.
It only covers how to get them installed and configured.

Assuming, you are using Browserify, you will want to install
the various module needed to make it work with Junior and dependencies.
Here are some recommended dependency options for your `package.json`:

```json
"devDependencies": {
  "debowerify": "0.7.1",
  "browserify-shim": "3.5.0",
  "grunt-browserify": "2.1.0",
  "grunt-contrib-less": "0.11.0",
  "grunt-bowercopy": "1.0.0",
  ...
},
```

At this point, per the NPM docs, to install NPM packages, run `npm install`.

You will need to install Junior via Bower. Here is an example
entry in `bower.json`. The `junior` package will install
`lodash` as `underscore`, to prevent `backbone` from installing
and using the real `underscore`:

```json
"devDependencies": {
 "junior": "justspamjustin/junior#master"
 ...
}
```

In `Gruntfile.js`, you will probably want to have your `ratchet` fonts
moved somewhere into your web root. Note that if you decide to do this,
you will need to install your bower packages via `grunt bowercopy` instead
of `bower install` or `grunt bower install`:

```json
bowercopy: {
  web: {
    files: [
      {'builds/web/fonts': 'ratchet/fonts/*.*'}
    ]
  },
  ...
}
```

At this point you will want to run `grunt bowercopy`, which will install
and copy your `bower` packages.

You will probably want to setup some Browserify transforms.
Here is an example in `package.json`. `browserify-shim` will
allow you to setup shims so that the AMD modules can still work
within the CommonJS style setup. `debowerify` will allow you to
easily `require()` your Bower packages:

```json
"browserify": {
 "transform": [
   "browserify-shim",
   "debowerify",
   ...
 ]
}
```

In `package.json`, you will also want to setup your aliases
to the various packages, so they can be easily referenced
elsewhere. Per the note above, `lodash` has been installed
as `underscore`, so our alias should be consistent with that:

```json
"browser": {
  "zepto": "./bower_components/zepto/zepto.js",
  "underscore": "./bower_components/underscore/dist/lodash.compat.js",
  "backbone": "./bower_components/backbone/backbone.js",
  "modernizr": "./bower_components/modernizr/modernizr.js",
  "flickable": "./bower_components/flickable/index.js",
  "junior": "./bower_components/junior/src/javascripts/junior.js",
  "ratchet": "./bower_components/ratchet/dist/js/ratchet.js",
  ...
}
```

In `package.json`, you will also want to setup your shims. This
will enable the modules to be accessible and properly resolve their
dependencies:

```json
"browserify-shim": {
  "zepto": {
    "exports": "$"
  },
  "underscore": {
    "exports": "_"
  },
  "backbone": {
    "depends": ["zepto", "underscore"],
    "exports": "Backbone"
  },
  "modernizr": {
    "exports": "Modernizr"
  },
  "flickable": {
    "depends": ["zepto", "modernizr"],
    "exports": "$.fn.flickable"
  },
  "junior": {
    "depends": [
      "zepto",
      "underscore",
      "backbone",
      "modernizr",
      "flickable",
      "ratchet"
    ],
    "exports": "Jr"
  },
  ...
}
```

Per, the `browserify` docs, in `Gruntfile.js`, you will want to setup
your `browserify` settings:

```json
browserify: {
  web: {
    files: [
      {'builds/web/js/build.js': 'src/js/main.js'}
    ]
  }
}
```

Somewhere, early in your JS code, preferrably at the top of your main
file, you will want to load everything. Below/after this code, you can now
use `Jr` per the `junior` usage documentation:

```javascript
require('underscore');
var Backbone = require('backbone');
var $ = require('zepto');
Backbone.$ = $;
require('modernizr');
require('flickable');
require('ratchet');
var Jr = require('junior');
```

At this point, you will want to build your JS, by running `grunt browserify`.

If you prefer to use LESS, you will want to setup your `ratchet`/`junior`
LESS dependencies. Make a `junior.less` file and place this in it:

```less
@import (inline) "RELATIVE_PATH_TO/bower_components/ratchet/dist/css/ratchet.css";
@import (inline) "RELATIVE_PATH_TO/bower_components/ratchet/dist/css/ratchet-theme-ios.css";
@import (inline) "RELATIVE_PATH_TO/bower_components/junior/src/stylesheets/junior.css";
```

If you are using LESS, you will want to add the LESS build steps:

```json
less: {
  web: {
    files: [
      {'builds/web/css/build.css': 'src/less/main.less'}
    ]
  },
  ...
}
```

At this point you will want to build your LESS/CSS by running `grunt less`.

