"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "convertHEXToRGBA", {
  enumerable: true,
  get: function get() {
    return _hexRgb["default"];
  }
});
Object.defineProperty(exports, "convertRGBAToHEX", {
  enumerable: true,
  get: function get() {
    return _rgbHex["default"];
  }
});
exports.convertRGBAToHSLA = exports.convertHSVToRGB = exports.convertGammaCompressedRGBtoLinearRGB = exports.convertColorToRGBA = void 0;

var _hexRgb = _interopRequireDefault(require("hex-rgb"));

var _rgbHex = _interopRequireDefault(require("rgb-hex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * sRGB
 * https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
 *
 * @param {Number} x R or G or B, 0 to 255
 */
var convertGammaCompressedRGBtoLinearRGB = function convertGammaCompressedRGBtoLinearRGB(x) {
  var xsrgb = x / 255;
  return xsrgb <= 0.04045 ? xsrgb / 12.92 : Math.pow((xsrgb + 0.055) / 1.055, 2.4);
};
/**
 *
 * @param {Array | String} color
 */


exports.convertGammaCompressedRGBtoLinearRGB = convertGammaCompressedRGBtoLinearRGB;

var convertColorToRGBA = function convertColorToRGBA(color) {
  if (_typeof(color) === "object" && (color.length === 3 || color.length === 4)) {
    return color;
  }

  if (typeof color === "string") {
    var res = (0, _hexRgb["default"])(color);
    return [res.red, res.green, res.blue, res.alpha];
  }

  throw new TypeError("Expected either an array or a string");
};
/**
 * https://css-tricks.com/converting-color-spaces-in-javascript/
 * @param {Array} rgb
 */


exports.convertColorToRGBA = convertColorToRGBA;

var convertRGBAToHSLA = function convertRGBAToHSLA(rgb) {
  // Make r, g, and b fractions of 1
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var alpha = rgb[3] || 1; // Find greatest and smallest channel values

  var cmin = Math.min(r, g, b);
  var cmax = Math.max(r, g, b);
  var delta = cmax - cmin;
  var h = 0,
      s = 0,
      l = 0; // Calculate hue...

  if (delta !== 0) {
    switch (cmax) {
      case r:
        // red is max
        h = (g - b) / delta % 6;
        break;

      case g:
        // green is max
        h = (b - r) / delta + 2;
        break;

      default:
        // blue is max
        h = (r - g) / delta + 4;
        break;
    }
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h = 360 + h;
  } // Calculate lightness...


  l = (cmax + cmin) / 2; // Calculate saturation

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); // Multiply l and s by 100 since we want percentages

  s = Number((s * 100).toFixed(1));
  l = Number((l * 100).toFixed(1));
  return [h, s, l, alpha];
};
/**
 * https://en.wikipedia.org/wiki/HSL_and_HSV
 * https://www.easyrgb.com/en/math.php
 *
 * @param {Array} hsv
 */


exports.convertRGBAToHSLA = convertRGBAToHSLA;

var convertHSVToRGB = function convertHSVToRGB(hsv) {
  var h = hsv[0] / 360;
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var mod = Math.floor(h * 6);
  var f = h * 6 - mod;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var r = Math.round([v, q, p, p, t, v][mod] * 255);
  var g = Math.round([t, v, v, q, p, p][mod] * 255);
  var b = Math.round([p, p, t, v, v, q][mod] * 255);
  return [r, g, b];
};

exports.convertHSVToRGB = convertHSVToRGB;