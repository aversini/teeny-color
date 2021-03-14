/* eslint-disable no-bitwise, no-magic-numbers */
import {
  convertColorToRGBA,
  convertHSVToRGB,
  convertRGBAToHEX,
  convertRGBAToHSLA,
} from "./colors";

import { isAccessible } from "./accessibility";

const LUMINOSITY_BRIGHT = "bright";
const LUMINOSITY_LIGHT = "light";
const LUMINOSITY_DARK = "dark";

export class RandomColor {
  constructor({
    color = "blue",
    backgroundColor = "#212121",
    wcagLevel = "AA",
    luminosity = "light",
  } = {}) {
    this.fromColor = color;
    this.backgroundColor = backgroundColor;
    this.wcagLevel = wcagLevel;
    this.luminosity = luminosity;
    this.colorDictionary = {};

    // load color bounds
    this._defineColor("monochrome", null, [
      [0, 0],
      [100, 0],
    ]);

    this._defineColor(
      "red",
      [-26, 18],
      [
        [20, 100],
        [30, 92],
        [40, 89],
        [50, 85],
        [60, 78],
        [70, 70],
        [80, 60],
        [90, 55],
        [100, 50],
      ]
    );

    this._defineColor(
      "orange",
      [18, 46],
      [
        [20, 100],
        [30, 93],
        [40, 88],
        [50, 86],
        [60, 85],
        [70, 70],
        [100, 70],
      ]
    );

    this._defineColor(
      "yellow",
      [46, 62],
      [
        [25, 100],
        [40, 94],
        [50, 89],
        [60, 86],
        [70, 84],
        [80, 82],
        [90, 80],
        [100, 75],
      ]
    );

    this._defineColor(
      "green",
      [62, 178],
      [
        [30, 100],
        [40, 90],
        [50, 85],
        [60, 81],
        [70, 74],
        [80, 64],
        [90, 50],
        [100, 40],
      ]
    );

    this._defineColor(
      "blue",
      [178, 257],
      [
        [20, 100],
        [30, 86],
        [40, 80],
        [50, 74],
        [60, 60],
        [70, 52],
        [80, 44],
        [90, 39],
        [100, 35],
      ]
    );

    this._defineColor(
      "purple",
      [257, 282],
      [
        [20, 100],
        [30, 87],
        [40, 79],
        [50, 70],
        [60, 65],
        [70, 59],
        [80, 52],
        [90, 45],
        [100, 42],
      ]
    );

    this._defineColor(
      "pink",
      [282, 334],
      [
        [20, 100],
        [30, 90],
        [40, 86],
        [60, 84],
        [80, 80],
        [90, 75],
        [100, 73],
      ]
    );
  }

  _defineColor(name, hueRange, lowerBounds) {
    const sMin = lowerBounds[0][0];
    const sMax = lowerBounds[lowerBounds.length - 1][0];
    const bMin = lowerBounds[lowerBounds.length - 1][1];
    const bMax = lowerBounds[0][1];

    this.colorDictionary[name] = {
      brightnessRange: [bMin, bMax],
      hueRange,
      lowerBounds,
      saturationRange: [sMin, sMax],
    };
  }

  _getHueRange() {
    if (this.colorDictionary[this.fromColor]) {
      const color = this.colorDictionary[this.fromColor];
      if (color.hueRange) {
        return color.hueRange;
      }
    } else {
      const hue = convertRGBAToHSLA(convertColorToRGBA(this.fromColor))[0];
      return [hue, hue];
    }
    return [0, 360];
  }

  _randomWithinRange(range, seed) {
    if (seed === null) {
      /**
       * generate random evenly destinct number from:
       * https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
       */
      const goldenRatio = 0.618033988749895;
      let r = Math.random();
      r += goldenRatio;
      r %= 1;
      return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
    } else {
      /**
       * Seeded random algorithm from:
       * http://indiegamr.com/generate-repeatable-random-numbers-in-js/
       */
      const max = range[1] || 1;
      const min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  _convertSeedToInteger(seed) {
    if (typeof seed === "string") {
      let total = 0;
      for (let i = 0; i !== seed.length; i++) {
        /* istanbul ignore if */
        if (total >= Number.MAX_SAFE_INTEGER) break;
        total += seed.charCodeAt(i);
      }
      return total;
    }
    return seed;
  }

  _getColorInfo(hue) {
    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }

    for (const colorName in this.colorDictionary) {
      /* istanbul ignore else */
      if ({}.hasOwnProperty.call(this.colorDictionary, colorName)) {
        const color = this.colorDictionary[colorName];
        if (
          color.hueRange &&
          hue >= color.hueRange[0] &&
          hue <= color.hueRange[1]
        ) {
          return this.colorDictionary[colorName];
        }
      }
    }
    return "Color not found";
  }

  _getMinimumBrightness(hue, saturation) {
    const lowerBounds = this._getColorInfo(hue).lowerBounds;

    for (let i = 0; i < lowerBounds.length - 1; i++) {
      const s1 = lowerBounds[i][0];
      const v1 = lowerBounds[i][1];

      const s2 = lowerBounds[i + 1][0];
      const v2 = lowerBounds[i + 1][1];

      if (saturation >= s1 && saturation <= s2) {
        const m = (v2 - v1) / (s2 - s1);
        const b = v1 - m * s1;
        return m * saturation + b;
      }
    }
    return 0;
  }

  _getRandomHue(seed) {
    const hueRange = this._getHueRange();
    let hue = this._randomWithinRange(hueRange, seed);
    /*
     * Instead of storing red as two seperate ranges,
     * we group them, using negative numbers
     */
    if (hue < 0) {
      hue = 360 + hue;
    }
    return hue;
  }

  _getRandomSaturation(hue, seed) {
    if (this.fromColor === "monochrome") {
      return 0;
    }
    const saturationRange = this._getColorInfo(hue).saturationRange;
    let sMin = saturationRange[0],
      sMax = saturationRange[1];

    switch (this.luminosity) {
      case LUMINOSITY_BRIGHT:
        sMin = 55;
        break;
      case LUMINOSITY_DARK:
        sMin = sMax - 10;
        break;
      default:
        sMax = 55;
        break;
    }
    return this._randomWithinRange([sMin, sMax], seed);
  }

  _getRandomBrightness(hue, saturation, seed) {
    let bMin = this._getMinimumBrightness(hue, saturation),
      bMax = 100;

    switch (this.luminosity) {
      case LUMINOSITY_DARK:
        bMax = bMin + 20;
        break;
      case LUMINOSITY_LIGHT:
        bMin = (bMax + bMin) / 2;
        break;
      default:
        bMin = 0;
        bMax = 100;
        break;
    }
    return this._randomWithinRange([bMin, bMax], seed);
  }

  _getRandomColor(seed) {
    const hue = this._getRandomHue(seed);
    const saturation = this._getRandomSaturation(hue, seed);
    const brightness = this._getRandomBrightness(hue, saturation, seed);
    return convertHSVToRGB([hue, saturation, brightness]);
  }

  color(seed = null) {
    const MAX_TRIES = 100;
    let rgb,
      tries = 0;

    const seedInt = this._convertSeedToInteger(seed);
    rgb = this._getRandomColor(seedInt);

    while (
      !isAccessible(rgb, this.backgroundColor, this.wcagLevel) &&
      tries < MAX_TRIES
    ) {
      tries++;
      rgb = this._getRandomColor(seedInt);
    }
    if (tries === MAX_TRIES) {
      /**
       * None of the tries did come up with
       * an accessible contrast for the colors...
       * Trying to change luminosity and hope for
       * the best.
       */
      const luminosity = this.luminosity;
      this.luminosity =
        luminosity === LUMINOSITY_LIGHT ? LUMINOSITY_DARK : LUMINOSITY_LIGHT;
      tries = 0;
      rgb = this._getRandomColor(seedInt);
      while (
        !isAccessible(rgb, this.backgroundColor, this.wcagLevel) &&
        tries < MAX_TRIES
      ) {
        tries++;
        rgb = this._getRandomColor(seedInt);
      }
      // resetting to original luminosity
      this.luminosity = luminosity;
    }

    return tries === MAX_TRIES
      ? null
      : `#${convertRGBAToHEX(rgb[0], rgb[1], rgb[2])}`;
  }
}
