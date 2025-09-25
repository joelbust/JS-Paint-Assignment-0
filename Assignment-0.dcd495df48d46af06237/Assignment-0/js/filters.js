"use strict";

var Filters = Filters || {};

////////////////////////////////////////////////////////////////////////////////
// General utility functions
////////////////////////////////////////////////////////////////////////////////

// Constrain val to the range [min, max]
function clamp(val, min, max) {
  /* Shorthand for:
   * if (val < min) {
   *   return min;
   * } else if (val > max) {
   *   return max;
   * } else {
   *   return val;
   * }
   */
  return ((val < min) ? min : ((val > max) ? max : val));
}

// extract vertex coordinates from a URL string
function stringToCoords( vertsString ) {
  var centers = [];
  var coordStrings = vertsString.split("x");
  var coordsSoFar = 0;
  for (var i = 0; i < coordStrings.length; i++) {
    var coords = coordStrings[i].split("y");
    var x = parseInt(coords[0]);
    var y = parseInt(coords[1]);
    if (!isNaN(x) && !isNaN(y)) {
      centers.push({x: x, y: y})
    }
  }

  return centers;
}

////////////////////////////////////////////////////////////////////////////////
// Filters
////////////////////////////////////////////////////////////////////////////////

// Fill the entire image with color
Filters.fillFilter = function( image, color ) {
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      // uncomment this line to enable this function
      image.setPixel(x, y, color);
    }
  }
  return image;
};

// At each center, draw a solid circle with the specified radius and color
Filters.brushFilter = function( image, radius, color, vertsString ) {
  // centers is an array of (x, y) coordinates that each defines a circle center
  if (!(color instanceof Pixel)) {
    if (typeof color === "string") color = new Pixel(color);
    else if (Array.isArray(color)) color = new Pixel(color[0], color[1], color[2], (color[3] ?? 1), "rgb");
    else color = new Pixel(0,0,0,1,"rgb");
  }

  var centers = stringToCoords(vertsString);
  var r = Math.max(0, radius|0), r2 = r*r;

  for (let i = 0; i < centers.length; i++) {
    let c = centers[i], cx = (Array.isArray(c)? c[0] : c.x), cy = (Array.isArray(c)? c[1] : c.y);
    let x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(image.width  - 1, Math.ceil(cx + r));
    let y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(image.height - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      let dy = y - cy;
      for (let x = x0; x <= x1; x++) {
        let dx = x - cx;
        if (dx*dx + dy*dy <= r2) image.setPixel(x, y, color);  // solid overwrite
      }
    }
  }
  //Gui.alertOnce ('brushFilter is not implemented yet');

  return image;
};

/*
 * At each center, draw a soft circle with the specified radius and color.
 * Pixel opacity should linearly decrease with the radius from alpha_at_center to 0.
 */
Filters.softBrushFilter = function( image, radius, color, alpha_at_center, vertsString ) {
  // centers is an array of (x, y) coordinates that each defines a circle center
  var centers = stringToCoords(vertsString);

  // draw a filled circle with opacity equals to alpha_at_center at the center of each circle
  // the opacity decreases linearly along the radius and becomes zero at the edge of the circle
  // radius and color are specified in function arguments.
  // ----------- STUDENT CODE BEGIN ------------
  if (!(color instanceof Pixel)) {
    if (typeof color === "string") color = new Pixel(color);
    else if (Array.isArray(color)) color = new Pixel(color[0], color[1], color[2], (color[3] ?? 1), "rgb");
    else color = new Pixel(0,0,0,1,"rgb");
  }

  var r = Math.max(0, +radius || 0); if (!r) return image;
  var a0 = Math.max(0, Math.min(1, +alpha_at_center || 0));
  var paintA = Math.max(0, Math.min(1, (color.a != null ? color.a : 1)));

  for (let i = 0; i < centers.length; i++) {
    let c = centers[i], cx = (Array.isArray(c)? c[0] : c.x), cy = (Array.isArray(c)? c[1] : c.y);
    let x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(image.width  - 1, Math.ceil(cx + r));
    let y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(image.height - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      let dy = y - cy;
      for (let x = x0; x <= x1; x++) {
        let dx = x - cx, d2 = dx*dx + dy*dy;
        if (d2 <= r*r) {
          let a = a0 * (1 - Math.sqrt(d2)/r) * paintA;
          if (a > 0) {
            let src = image.getPixel(x, y);
            let out = src.multipliedBy(1 - a).plus(color.multipliedBy(a));
            out.a = src.a;     // leave alpha channel unchanged
            out.clamp();
            image.setPixel(x, y, out);
          }
        }
      }
    }
  }
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('softBrushFilter is not implemented yet');

  return image;
};

Filters.softFill = function( image, color, opacity ) {
  // You can use this filter to do whatever you want
  // ----------- STUDENT CODE BEGIN ------------
  if (typeof color === "string") {
    color = new Pixel(color);
  }
  var a = Math.max(0, Math.min(1, Number(opacity) || 0)); // clamp 0..1
  if (!a) return image;

  for (var y = 0; y < image.height; y++) {
    for (var x = 0; x < image.width; x++) {
      var src = image.getPixel(x, y);
      // out = src*(1 - a) + color*a
      var out = src.multipliedBy(1 - a).plus(color.multipliedBy(a));
      out.a = src.a; // leave per-pixel alpha unchanged
      image.setPixel(x, y, out);
    }
  }
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('customFilter is not implemented yet');
  return image;
};
