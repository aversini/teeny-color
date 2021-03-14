"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RandomColor = void 0;

var _colors = require("./colors");

var _accessibility = require("./accessibility");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LUMINOSITY_BRIGHT = "bright";
var LUMINOSITY_LIGHT = "light";
var LUMINOSITY_DARK = "dark";

var RandomColor = /*#__PURE__*/function () {
  function RandomColor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$color = _ref.color,
        color = _ref$color === void 0 ? "blue" : _ref$color,
        _ref$backgroundColor = _ref.backgroundColor,
        backgroundColor = _ref$backgroundColor === void 0 ? "#212121" : _ref$backgroundColor,
        _ref$wcagLevel = _ref.wcagLevel,
        wcagLevel = _ref$wcagLevel === void 0 ? "AA" : _ref$wcagLevel,
        _ref$luminosity = _ref.luminosity,
        luminosity = _ref$luminosity === void 0 ? "light" : _ref$luminosity,
        _ref$ada = _ref.ada,
        ada = _ref$ada === void 0 ? true : _ref$ada;

    _classCallCheck(this, RandomColor);

    this.fromColor = color;
    this.backgroundColor = backgroundColor;
    this.wcagLevel = wcagLevel;
    this.luminosity = luminosity;
    this.ada = ada;
    this.colorDictionary = {}; // load color bounds

    this._defineColor("monochrome", null, [[0, 0], [100, 0]]);

    this._defineColor("red", [-26, 18], [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]);

    this._defineColor("orange", [18, 46], [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]);

    this._defineColor("yellow", [46, 62], [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]);

    this._defineColor("green", [62, 178], [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]);

    this._defineColor("blue", [178, 257], [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]);

    this._defineColor("purple", [257, 282], [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]);

    this._defineColor("pink", [282, 334], [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]);
  }

  _createClass(RandomColor, [{
    key: "_defineColor",
    value: function _defineColor(name, hueRange, lowerBounds) {
      var sMin = lowerBounds[0][0];
      var sMax = lowerBounds[lowerBounds.length - 1][0];
      var bMin = lowerBounds[lowerBounds.length - 1][1];
      var bMax = lowerBounds[0][1];
      this.colorDictionary[name] = {
        brightnessRange: [bMin, bMax],
        hueRange: hueRange,
        lowerBounds: lowerBounds,
        saturationRange: [sMin, sMax]
      };
    }
  }, {
    key: "_getHueRange",
    value: function _getHueRange() {
      if (this.colorDictionary[this.fromColor]) {
        var color = this.colorDictionary[this.fromColor];

        if (color.hueRange) {
          return color.hueRange;
        }
      } else {
        var hue = (0, _colors.convertRGBAToHSLA)((0, _colors.convertColorToRGBA)(this.fromColor))[0];
        return [hue, hue];
      }

      return [0, 360];
    }
  }, {
    key: "_randomWithinRange",
    value: function _randomWithinRange(range, seed) {
      if (seed === null) {
        /**
         * generate random evenly destinct number from:
         * https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
         */
        var goldenRatio = 0.618033988749895;
        var r = Math.random();
        r += goldenRatio;
        r %= 1;
        return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
      } else {
        /**
         * Seeded random algorithm from:
         * http://indiegamr.com/generate-repeatable-random-numbers-in-js/
         */
        var max = range[1] || 1;
        var min = range[0] || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280.0;
        return Math.floor(min + rnd * (max - min));
      }
    }
  }, {
    key: "_convertSeedToInteger",
    value: function _convertSeedToInteger(seed) {
      if (typeof seed === "string") {
        var total = 0;

        for (var i = 0; i !== seed.length; i++) {
          if (total >= Number.MAX_SAFE_INTEGER) break;
          total += seed.charCodeAt(i);
        }

        return total;
      }

      return seed;
    }
  }, {
    key: "_getColorInfo",
    value: function _getColorInfo(hue) {
      // Maps red colors to make picking hue easier
      if (hue >= 334 && hue <= 360) {
        hue -= 360;
      }

      for (var colorName in this.colorDictionary) {
        if ({}.hasOwnProperty.call(this.colorDictionary, colorName)) {
          var color = this.colorDictionary[colorName];

          if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
            return this.colorDictionary[colorName];
          }
        }
      }

      return "Color not found";
    }
  }, {
    key: "_getMinimumBrightness",
    value: function _getMinimumBrightness(hue, saturation) {
      var lowerBounds = this._getColorInfo(hue).lowerBounds;

      for (var i = 0; i < lowerBounds.length - 1; i++) {
        var s1 = lowerBounds[i][0];
        var v1 = lowerBounds[i][1];
        var s2 = lowerBounds[i + 1][0];
        var v2 = lowerBounds[i + 1][1];

        if (saturation >= s1 && saturation <= s2) {
          var m = (v2 - v1) / (s2 - s1);
          var b = v1 - m * s1;
          return m * saturation + b;
        }
      }

      return 0;
    }
  }, {
    key: "_getRandomHue",
    value: function _getRandomHue(seed) {
      var hueRange = this._getHueRange();

      var hue = this._randomWithinRange(hueRange, seed);
      /*
       * Instead of storing red as two seperate ranges,
       * we group them, using negative numbers
       */


      if (hue < 0) {
        hue = 360 + hue;
      }

      return hue;
    }
  }, {
    key: "_getRandomSaturation",
    value: function _getRandomSaturation(hue, seed) {
      if (this.fromColor === "monochrome") {
        return 0;
      }

      var saturationRange = this._getColorInfo(hue).saturationRange;

      var sMin = saturationRange[0],
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
  }, {
    key: "_getRandomBrightness",
    value: function _getRandomBrightness(hue, saturation, seed) {
      var bMin = this._getMinimumBrightness(hue, saturation),
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
  }, {
    key: "_getRandomColor",
    value: function _getRandomColor(seed) {
      var hue = this._getRandomHue(seed);

      var saturation = this._getRandomSaturation(hue, seed);

      var brightness = this._getRandomBrightness(hue, saturation, seed);

      return (0, _colors.convertHSVToRGB)([hue, saturation, brightness]);
    }
  }, {
    key: "color",
    value: function color() {
      var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var MAX_TRIES = 100;
      var rgb,
          tries = 0;

      var seedInt = this._convertSeedToInteger(seed);

      rgb = this._getRandomColor(seedInt);

      if (this.ada) {
        while (!(0, _accessibility.isAccessible)(rgb, this.backgroundColor, this.wcagLevel) && tries < MAX_TRIES) {
          tries++;
          rgb = this._getRandomColor(seedInt);
        }

        if (tries === MAX_TRIES) {
          /**
           * None of the 100 tries did come up with
           * an accessible contrast for the colors...
           * Trying to change luminosity and hope for
           * the best.
           */
          var luminosity = this.luminosity;
          this.luminosity = luminosity === LUMINOSITY_LIGHT ? LUMINOSITY_DARK : LUMINOSITY_LIGHT;
          tries = 0;
          rgb = this._getRandomColor(seedInt);

          while (!(0, _accessibility.isAccessible)(rgb, this.backgroundColor, this.wcagLevel) && tries < MAX_TRIES) {
            tries++;
            rgb = this._getRandomColor(seedInt);
          } // resetting to original luminosity


          this.luminosity = luminosity;
        }
      }

      return tries === MAX_TRIES ? null : "#".concat((0, _colors.convertRGBAToHEX)(rgb[0], rgb[1], rgb[2]));
    }
  }]);

  return RandomColor;
}();

exports.RandomColor = RandomColor;