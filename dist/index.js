'use strict';

// WindowResizer 2.1.0
// Copyright (C) 2013-2018 ConsidoNet Solutions / www.considonet.com
// Released under MIT Licence

/*
VERSION HISTORY
2.1.0 (20181125) @pg
+ switch to GitHub, file cleanup

2.0.1 (20180718) @pg
+ .npmignore file, removed source and .idea stuff from the actual package

2.0.0 (20180717) @pg
+ Switched to semver
- Dropped support for deprecated .add method
* Dist package now transpiled from ES6 (compatibility with building environments not transpiling node_modules)
+ Source linted with tslint

1.4.3.20180312 @pg
+ jQuery/g-sel dependency dropped

1.4.2.20180215 @pg
+ TypeScript declarations

1.4.1.20171106 @pg
* Now acting as a separate npm module

1.4.0.20170822 @pg
+ ES6

*/

var index = (function () {

  var resizers = [];
  var breakpointResizers = [];
  var orientationResizers = [];
  var lastBreakpoint = "";

  var breakpoints = { // Twitter Bootstrap 3.0 defaults, min-width => breakpoint name
    "0": "xs",
    "768": "sm",
    "992": "md",
    "1200": "lg"
  };

  // Private methods
  var getScreenDimensions = function getScreenDimensions() {
    return {
      w: window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth,
      h: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName("body")[0].clientHeight
    };
  };

  var onResize = function onResize() {

    var dims = getScreenDimensions();

    if (breakpointResizers.length > 0) {

      var breakpoint = "";

      Object.keys(breakpoints).forEach(function (width) {
        breakpoint = dims.w >= width ? breakpoints[width] : breakpoint;
      });

      if (lastBreakpoint !== breakpoint) {

        lastBreakpoint = breakpoint;

        breakpointResizers.forEach(function (resizer) {
          resizer(dims.w, dims.h, breakpoint);
        });
      }
    }

    resizers.forEach(function (resizer) {
      resizer(dims.w, dims.h);
    });
  };

  var onOrientationChange = function onOrientationChange() {

    if (orientationResizers.length > 0) {

      var dims = getScreenDimensions();
      var orientation = void 0;

      if (dims.w >= dims.h) {
        orientation = "h";
      } else {
        orientation = "v";
      }

      orientationResizers.forEach(function (resizer) {
        resizer(dims.w, dims.h, orientation);
      });
    }
  };

  var assignEvent = function assignEvent(el, eventName, handler) {

    if (typeof el.addEventListener !== "undefined") {
      el.addEventListener(eventName, handler, false);
    } else if (typeof el.attachEvent !== "undefined") {
      el.attachEvent("on" + eventName, handler);
    }
  };

  var triggerEvent = function triggerEvent(el, eventName) {

    var ev = window.document.createEvent("UIEvents");
    ev.initUIEvent(eventName, true, false, el, 0);
    el.dispatchEvent(ev);
  };

  // Initialization
  assignEvent(window, "resize", onResize);
  assignEvent(window, "orientationchange", onOrientationChange);

  assignEvent(window, "load", function () {
    triggerEvent(window, "resize");
  });

  return {

    // Public methods
    onResize: function onResize(fn) {

      resizers.push(fn);
    },
    onBreakpointChange: function onBreakpointChange(fn) {

      breakpointResizers.push(fn);
    },
    onOrientationChange: function onOrientationChange(fn) {

      orientationResizers.push(fn);
    },
    overrideBreakpoints: function overrideBreakpoints(bp) {

      breakpoints = bp;
    }
  };
})();

module.exports = index;
