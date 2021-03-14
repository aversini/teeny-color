"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAccessible = exports.wcagScore = exports.contrastRatio = void 0;

var _colors = require("./colors");

/* eslint-disable no-magic-numbers */

/**
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 * https://en.wikipedia.org/wiki/Luminance_(relative)
 *
 * @param {Array} rgb
 */
var relativeLuminance = function relativeLuminance(rgb) {
  var r = (0, _colors.convertGammaCompressedRGBtoLinearRGB)(rgb[0]);
  var g = (0, _colors.convertGammaCompressedRGBtoLinearRGB)(rgb[1]);
  var b = (0, _colors.convertGammaCompressedRGBtoLinearRGB)(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/**
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * @param {String | Array}  color1 first color in hexa (string) or rgb (array)
 * @param {String | Array}  color1 second color in hexa (string) or rgb (array)
 * @returns {Number} number from 1 to 21 (commonly written 1:1 to 21:1)
 */


var contrastRatio = function contrastRatio(color1, color2) {
  var rgb1 = (0, _colors.convertColorToRGBA)(color1);
  var rgb2 = (0, _colors.convertColorToRGBA)(color2);
  var rl1 = relativeLuminance(rgb1);
  var rl2 = relativeLuminance(rgb2);
  var lightest = Math.max(rl1, rl2);
  var darkest = Math.min(rl1, rl2);
  return (lightest + 0.05) / (darkest + 0.05);
};

exports.contrastRatio = contrastRatio;

var wcagScore = function wcagScore(color1, color2) {
  var contrast = contrastRatio(color1, color2);

  if (contrast >= 7) {
    return "AAA";
  }

  if (contrast >= 4.5) {
    return "AA";
  }

  return 0;
};

exports.wcagScore = wcagScore;

var isAccessible = function isAccessible(color1, color2) {
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "AA";
  var score = wcagScore(color1, color2);

  if (level === "AA" && (score === "AA" || score === "AAA")) {
    return true;
  }

  if (level === "AAA" && score === "AAA") {
    return true;
  }

  return false;
};

exports.isAccessible = isAccessible;