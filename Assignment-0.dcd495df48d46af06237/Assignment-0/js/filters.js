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
  var centers = stringToCoords(vertsString), r2 = radius * radius;

  if (typeof color === "string") color = new Pixel(color);

  for (var k = 0; k < centers.length; k++) {
    var cx = centers[k][0], cy = centers[k][1];
    for (var y = Math.max(0, cy - radius); y <= Math.min(image.height - 1, cy + radius); y++) {
      for (var x = Math.max(0, cx - radius); x <= Math.min(image.width - 1, cx + radius); x++) {
        var dx = x - cx, dy = y - cy;
        if (dx*dx + dy*dy <= r2) image.setPixel(x, y, color);
      }
    }
  }
  // ----------- STUDENT CODE END ------------
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
  if (typeof color === "string") color = new Pixel(color);
  var r = Math.max(0, radius);

  for (var k = 0; k < centers.length; k++) {
    var cx = centers[k][0], cy = centers[k][1];
    for (var y = Math.max(0, cy - r); y <= Math.min(image.height - 1, cy + r); y++) {
      for (var x = Math.max(0, cx - r); x <= Math.min(image.width - 1, cx + r); x++) {
        var dx = x - cx, dy = y - cy, d = Math.sqrt(dx*dx + dy*dy);
        if (d <= r) {
          var a = alphaCenter * (1 - d / r);
          var src = image.getPixel(x, y);
          var out = src.multipliedBy(1 - a).plus(color.multipliedBy(a));
          out.a = src.a;            
          image.setPixel(x, y, out);
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
