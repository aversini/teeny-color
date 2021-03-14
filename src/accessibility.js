/* eslint-disable no-magic-numbers */
import {
  convertColorToRGBA,
  convertGammaCompressedRGBtoLinearRGB,
} from "./colors";

/**
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 * https://en.wikipedia.org/wiki/Luminance_(relative)
 *
 * @param {Array} rgb
 */
const relativeLuminance = (rgb) => {
  const r = convertGammaCompressedRGBtoLinearRGB(rgb[0]);
  const g = convertGammaCompressedRGBtoLinearRGB(rgb[1]);
  const b = convertGammaCompressedRGBtoLinearRGB(rgb[2]);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * @param {String | Array}  color1 first color in hexa (string) or rgb (array)
 * @param {String | Array}  color1 second color in hexa (string) or rgb (array)
 * @returns {Number} number from 1 to 21 (commonly written 1:1 to 21:1)
 */
const contrastRatio = (color1, color2) => {
  const rgb1 = convertColorToRGBA(color1);
  const rgb2 = convertColorToRGBA(color2);
  const rl1 = relativeLuminance(rgb1);
  const rl2 = relativeLuminance(rgb2);
  const lightest = Math.max(rl1, rl2);
  const darkest = Math.min(rl1, rl2);
  return (lightest + 0.05) / (darkest + 0.05);
};

const wcagScore = (color1, color2) => {
  const contrast = contrastRatio(color1, color2);
  if (contrast >= 7) {
    return "AAA";
  }
  if (contrast >= 4.5) {
    return "AA";
  }
  return 0;
};

const isAccessible = (color1, color2, level = "AA") => {
  const score = wcagScore(color1, color2);
  if (level === "AA" && (score === "AA" || score === "AAA")) {
    return true;
  }
  if (level === "AAA" && score === "AAA") {
    return true;
  }
  return false;
};

export { contrastRatio, wcagScore, isAccessible };
