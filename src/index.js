// WindowResizer 2.0.1
// Copyright (C) 2013-2018 ConsidoNet Solutions / www.considonet.com
// Released under MIT Licence

/*
VERSION HISTORY
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

export default (() => {

  const resizers = [];
  const breakpointResizers = [];
  const orientationResizers = [];
  let lastBreakpoint = "";

  let breakpoints = { // Twitter Bootstrap 3.0 defaults, min-width => breakpoint name
    "0": "xs",
    "768": "sm",
    "992": "md",
    "1200": "lg"
  };

  // Private methods
  const getScreenDimensions = () => {
    return {
      w: window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth,
      h: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName("body")[0].clientHeight
    };
  };

  const onResize = () => {

    const dims = getScreenDimensions();

    if(breakpointResizers.length>0) {

      let breakpoint = "";

      Object.keys(breakpoints).forEach(width => {
        breakpoint = dims.w>=width ? breakpoints[width] : breakpoint;
      });

      if(lastBreakpoint!==breakpoint) {

        lastBreakpoint = breakpoint;

        breakpointResizers.forEach(resizer => {
          resizer(dims.w, dims.h, breakpoint);
        });

      }

    }

    resizers.forEach(resizer => {
      resizer(dims.w, dims.h);
    });

  };

  const onOrientationChange = function() {

    if(orientationResizers.length>0) {

      const dims = getScreenDimensions();
      let orientation;

      if(dims.w>=dims.h) {
        orientation = "h";
      } else {
        orientation = "v";
      }

      orientationResizers.forEach(resizer => {
        resizer(dims.w, dims.h, orientation);
      });

    }

  };

  const assignEvent = function(el, eventName, handler) {

    if(typeof el.addEventListener !== "undefined") {
      el.addEventListener(eventName, handler, false);
    } else if(typeof el.attachEvent !== "undefined") {
      el.attachEvent(`on${eventName}`, handler);
    }

  };

  const triggerEvent = function(el, eventName) {

    const ev = window.document.createEvent("UIEvents");
    ev.initUIEvent(eventName, true, false, el, 0);
    el.dispatchEvent(ev);

  };

  // Initialization
  assignEvent(window, "resize", onResize);
  assignEvent(window, "orientationchange", onOrientationChange);

  assignEvent(window, "load", () => {
    triggerEvent(window, "resize");
  });

  return {

    // Public methods
    onResize(fn) {

      resizers.push(fn);

    },

    onBreakpointChange(fn) {

      breakpointResizers.push(fn);

    },

    onOrientationChange(fn) {

      orientationResizers.push(fn);

    },

    overrideBreakpoints(bp) {

      breakpoints = bp;

    }

  };

})();
