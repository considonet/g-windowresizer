// WindowResizer 1.4.2.20180215
// Copyright (C) 2013-2018 ConsidoNet Solutions / www.considonet.com
// Released under MIT Licence

/*
VERSION HISTORY
1.4.2.20180215 @pg
+ TypeScript declarations

1.4.1.20171106 @pg
* Now acting as a separate npm module

1.4.0.20170822 @pg
+ ES6

*/

import { $window } from "@considonet/g-sel";

export default (() => {

  const resizers = [];
  const breakpointResizers = [];
  const orientationResizers = [];
  let lastBreakpoint = '';

  let breakpoints = { // Twitter Bootstrap 3.0 defaults, min-width => breakpoint name
    '0': 'xs',
    '768': 'sm',
    '992': 'md',
    '1200': 'lg'
  };

  // Private methods
  const onResize = () => {

    const w = $window.width();
    const h = $window.height();

    if(breakpointResizers.length>0) {

      let breakpoint = '';

      Object.keys(breakpoints).forEach(width => {
        breakpoint = w>=width ? breakpoints[width] : breakpoint;
      });

      if(lastBreakpoint!==breakpoint) {

        lastBreakpoint = breakpoint;

        breakpointResizers.forEach(resizer => {
          resizer(w, h, breakpoint);
        });

      }

    }

    resizers.forEach(resizer => {
      resizer(w, h);
    });

  };

  const onOrientationChange = function () {

    if(orientationResizers.length>0) {

      const w = $window.width();
      const h = $window.height();
      let orientation;

      if(w>=h) {
        orientation = 'h';
      } else {
        orientation = 'v';
      }

      orientationResizers.forEach(resizer => {
        resizer(w, h, orientation);
      });

    }

  };

  // Initialization
  $window.on("resize", onResize);
  $window.on('orientationchange', onOrientationChange);

  $window.on("load", () => {
    $window.trigger("resize");
  });

  return {

    // Public methods
    add(fn) { // deprecated

      console.log('Usage of WindowResizer.add() is deprecated, please use onResize instead');
      resizers.push(fn);

    },

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
