/* eslint-disable no-magic-numbers */
import convertHEXToRGBA from "hex-rgb";
import convertRGBAToHEX from "rgb-hex";

/**
 * sRGB
 * https://en.wikipedia.org/wiki/SRGB#The_reverse_transformation
 *
 * @param {Number} x R or G or B, 0 to 255
 */
const convertGammaCompressedRGBtoLinearRGB = (x) => {
  const xsrgb = x / 255;
  return xsrgb <= 0.04045
    ? xsrgb / 12.92
    : Math.pow((xsrgb + 0.055) / 1.055, 2.4);
};

/**
 *
 * @param {Array | String} color
 */
const convertColorToRGBA = (color) => {
  if (typeof color === "object" && (color.length === 3 || color.length === 4)) {
    return color;
  }
  if (typeof color === "string") {
    const res = convertHEXToRGBA(color);
    return [res.red, res.green, res.blue, res.alpha];
  }
  throw new TypeError("Expected either an array or a string");
};

/**
 * https://css-tricks.com/converting-color-spaces-in-javascript/
 * @param {Array} rgb
 */
const convertRGBAToHSLA = (rgb) => {
  // Make r, g, and b fractions of 1
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const alpha = rgb[3] || 1;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  // Calculate hue...
  if (delta !== 0) {
    switch (cmax) {
      case r:
        // red is max
        h = ((g - b) / delta) % 6;
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
  }

  // Calculate lightness...
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100 since we want percentages
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
const convertHSVToRGB = (hsv) => {
  const h = hsv[0] / 360;
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;

  const mod = Math.floor(h * 6);
  const f = h * 6 - mod;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  const r = Math.round([v, q, p, p, t, v][mod] * 255);
  const g = Math.round([t, v, v, q, p, p][mod] * 255);
  const b = Math.round([p, p, t, v, v, q][mod] * 255);

  return [r, g, b];
};

export {
  convertColorToRGBA,
  convertGammaCompressedRGBtoLinearRGB,
  convertHEXToRGBA,
  convertHSVToRGB,
  convertRGBAToHSLA,
  convertRGBAToHEX,
};
