/* eslint-disable no-magic-numbers */
import {
  RandomColor,
  contrastRatio,
  convertColorToRGBA,
  convertHSVToRGB,
  convertRGBAToHSLA,
  isAccessible,
  wcagScore,
} from "..";

describe(`Feature: the WCAG contrast ratio score`, () => {
  describe.each`
    color1    | color2    | expectedRatio | expectedScore
    ${"#000"} | ${"#000"} | ${1}          | ${0}
    ${"#300"} | ${"#000"} | ${1.1}        | ${0}
    ${"#330"} | ${"#000"} | ${1.6}        | ${0}
    ${"#030"} | ${"#000"} | ${1.5}        | ${0}
    ${"#033"} | ${"#000"} | ${1.5}        | ${0}
    ${"#003"} | ${"#000"} | ${1}          | ${0}
    ${"#303"} | ${"#000"} | ${1.2}        | ${0}
    ${"#600"} | ${"#000"} | ${1.6}        | ${0}
    ${"#630"} | ${"#000"} | ${2}          | ${0}
    ${"#660"} | ${"#000"} | ${3.5}        | ${0}
    ${"#360"} | ${"#000"} | ${3}          | ${0}
    ${"#060"} | ${"#000"} | ${2.9}        | ${0}
    ${"#063"} | ${"#000"} | ${2.9}        | ${0}
    ${"#066"} | ${"#000"} | ${3.1}        | ${0}
    ${"#036"} | ${"#000"} | ${1.7}        | ${0}
    ${"#006"} | ${"#000"} | ${1.2}        | ${0}
    ${"#306"} | ${"#000"} | ${1.3}        | ${0}
    ${"#606"} | ${"#000"} | ${1.8}        | ${0}
    ${"#603"} | ${"#000"} | ${1.6}        | ${0}
    ${"#900"} | ${"#000"} | ${2.4}        | ${0}
    ${"#930"} | ${"#000"} | ${2.8}        | ${0}
    ${"#960"} | ${"#000"} | ${4.3}        | ${0}
    ${"#990"} | ${"#000"} | ${6.9}        | ${"AA"}
    ${"#690"} | ${"#000"} | ${6.1}        | ${"AA"}
    ${"#390"} | ${"#000"} | ${5.7}        | ${"AA"}
    ${"#090"} | ${"#000"} | ${5.6}        | ${"AA"}
    ${"#093"} | ${"#000"} | ${5.6}        | ${"AA"}
    ${"#096"} | ${"#000"} | ${5.7}        | ${"AA"}
    ${"#099"} | ${"#000"} | ${6}          | ${"AA"}
    ${"#069"} | ${"#000"} | ${3.4}        | ${0}
    ${"#039"} | ${"#000"} | ${1.9}        | ${0}
    ${"#009"} | ${"#000"} | ${1.5}        | ${0}
    ${"#309"} | ${"#000"} | ${1.6}        | ${0}
    ${"#609"} | ${"#000"} | ${2}          | ${0}
    ${"#909"} | ${"#000"} | ${2.8}        | ${0}
    ${"#906"} | ${"#000"} | ${2.5}        | ${0}
    ${"#903"} | ${"#000"} | ${2.4}        | ${0}
    ${"#c00"} | ${"#000"} | ${3.6}        | ${0}
    ${"#c30"} | ${"#000"} | ${4}          | ${0}
    ${"#c60"} | ${"#000"} | ${5.5}        | ${"AA"}
    ${"#c90"} | ${"#000"} | ${8.1}        | ${"AAA"}
    ${"#cc0"} | ${"#000"} | ${12.2}       | ${"AAA"}
    ${"#9c0"} | ${"#000"} | ${11}         | ${"AAA"}
    ${"#6c0"} | ${"#000"} | ${10.2}       | ${"AAA"}
    ${"#3c0"} | ${"#000"} | ${9.8}        | ${"AAA"}
    ${"#0c0"} | ${"#000"} | ${9.6}        | ${"AAA"}
    ${"#0c3"} | ${"#000"} | ${9.7}        | ${"AAA"}
    ${"#0c6"} | ${"#000"} | ${9.8}        | ${"AAA"}
    ${"#0c9"} | ${"#000"} | ${10.1}       | ${"AAA"}
    ${"#0cc"} | ${"#000"} | ${10.5}       | ${"AAA"}
    ${"#09c"} | ${"#000"} | ${6.4}        | ${"AA"}
    ${"#06c"} | ${"#000"} | ${3.8}        | ${0}
    ${"#03c"} | ${"#000"} | ${2.3}        | ${0}
    ${"#00c"} | ${"#000"} | ${1.9}        | ${0}
    ${"#30c"} | ${"#000"} | ${2}          | ${0}
    ${"#60c"} | ${"#000"} | ${2.4}        | ${0}
    ${"#90c"} | ${"#000"} | ${3.2}        | ${0}
    ${"#c0c"} | ${"#000"} | ${4.4}        | ${0}
    ${"#c09"} | ${"#000"} | ${4}          | ${0}
    ${"#c06"} | ${"#000"} | ${3.8}        | ${0}
    ${"#c03"} | ${"#000"} | ${3.6}        | ${0}
    ${"#f00"} | ${"#000"} | ${5.3}        | ${"AA"}
    ${"#f30"} | ${"#000"} | ${5.7}        | ${"AA"}
    ${"#f60"} | ${"#000"} | ${7.2}        | ${"AAA"}
    ${"#f90"} | ${"#000"} | ${9.8}        | ${"AAA"}
    ${"#fc0"} | ${"#000"} | ${13.9}       | ${"AAA"}
    ${"#ff0"} | ${"#000"} | ${19.6}       | ${"AAA"}
    ${"#cf0"} | ${"#000"} | ${17.9}       | ${"AAA"}
    ${"#9f0"} | ${"#000"} | ${16.7}       | ${"AAA"}
    ${"#6f0"} | ${"#000"} | ${15.9}       | ${"AAA"}
    ${"#3f0"} | ${"#000"} | ${15.4}       | ${"AAA"}
    ${"#0f0"} | ${"#000"} | ${15.3}       | ${"AAA"}
    ${"#0f3"} | ${"#000"} | ${15.4}       | ${"AAA"}
    ${"#0f6"} | ${"#000"} | ${15.5}       | ${"AAA"}
    ${"#0f9"} | ${"#000"} | ${15.8}       | ${"AAA"}
    ${"#0fc"} | ${"#000"} | ${16.2}       | ${"AAA"}
    ${"#0ff"} | ${"#000"} | ${16.7}       | ${"AAA"}
    ${"#0cf"} | ${"#000"} | ${11.1}       | ${"AAA"}
    ${"#09f"} | ${"#000"} | ${7}          | ${"AAA"}
    ${"#06f"} | ${"#000"} | ${4.3}        | ${0}
    ${"#03f"} | ${"#000"} | ${2.9}        | ${0}
    ${"#00f"} | ${"#000"} | ${2.4}        | ${0}
    ${"#30f"} | ${"#000"} | ${2.6}        | ${0}
    ${"#60f"} | ${"#000"} | ${3}          | ${0}
    ${"#90f"} | ${"#000"} | ${3.8}        | ${0}
    ${"#c0f"} | ${"#000"} | ${5}          | ${"AA"}
    ${"#f0f"} | ${"#000"} | ${6.7}        | ${"AA"}
    ${"#f0c"} | ${"#000"} | ${6.1}        | ${"AA"}
    ${"#f09"} | ${"#000"} | ${5.7}        | ${"AA"}
    ${"#f06"} | ${"#000"} | ${5.4}        | ${"AA"}
    ${"#f03"} | ${"#000"} | ${5.3}        | ${"AA"}
    ${"#f33"} | ${"#000"} | ${5.8}        | ${"AA"}
    ${"#f63"} | ${"#000"} | ${7.2}        | ${"AAA"}
    ${"#f93"} | ${"#000"} | ${9.9}        | ${"AAA"}
    ${"#fc3"} | ${"#000"} | ${13.9}       | ${"AAA"}
    ${"#ff3"} | ${"#000"} | ${19.6}       | ${"AAA"}
    ${"#cf3"} | ${"#000"} | ${17.9}       | ${"AAA"}
    ${"#9f3"} | ${"#000"} | ${16.7}       | ${"AAA"}
    ${"#6f3"} | ${"#000"} | ${15.9}       | ${"AAA"}
    ${"#3f3"} | ${"#000"} | ${15.5}       | ${"AAA"}
    ${"#3f6"} | ${"#000"} | ${15.6}       | ${"AAA"}
    ${"#3f9"} | ${"#000"} | ${15.9}       | ${"AAA"}
    ${"#3fc"} | ${"#000"} | ${16.3}       | ${"AAA"}
    ${"#3ff"} | ${"#000"} | ${16.9}       | ${"AAA"}
    ${"#3cf"} | ${"#000"} | ${11.2}       | ${"AAA"}
    ${"#39f"} | ${"#000"} | ${7.1}        | ${"AAA"}
    ${"#36f"} | ${"#000"} | ${4.5}        | ${0}
    ${"#33f"} | ${"#000"} | ${3.1}        | ${0}
    ${"#63f"} | ${"#000"} | ${3.5}        | ${0}
    ${"#93f"} | ${"#000"} | ${4.3}        | ${0}
    ${"#c3f"} | ${"#000"} | ${5.5}        | ${"AA"}
    ${"#f3f"} | ${"#000"} | ${7.2}        | ${"AAA"}
    ${"#f3c"} | ${"#000"} | ${6.6}        | ${"AA"}
    ${"#f39"} | ${"#000"} | ${6.2}        | ${"AA"}
    ${"#f36"} | ${"#000"} | ${5.9}        | ${"AA"}
    ${"#f66"} | ${"#000"} | ${7.3}        | ${"AAA"}
    ${"#f96"} | ${"#000"} | ${10}         | ${"AAA"}
    ${"#fc6"} | ${"#000"} | ${14.1}       | ${"AAA"}
    ${"#ff6"} | ${"#000"} | ${19.7}       | ${"AAA"}
    ${"#cf6"} | ${"#000"} | ${18.1}       | ${"AAA"}
    ${"#9f6"} | ${"#000"} | ${16.9}       | ${"AAA"}
    ${"#6f6"} | ${"#000"} | ${16.1}       | ${"AAA"}
    ${"#6f9"} | ${"#000"} | ${16.3}       | ${"AAA"}
    ${"#6fc"} | ${"#000"} | ${16.7}       | ${"AAA"}
    ${"#6ff"} | ${"#000"} | ${17.3}       | ${"AAA"}
    ${"#6cf"} | ${"#000"} | ${11.6}       | ${"AAA"}
    ${"#69f"} | ${"#000"} | ${7.6}        | ${"AAA"}
    ${"#66f"} | ${"#000"} | ${4.9}        | ${"AA"}
    ${"#96f"} | ${"#000"} | ${5.7}        | ${"AA"}
    ${"#c6f"} | ${"#000"} | ${6.9}        | ${"AA"}
    ${"#f6f"} | ${"#000"} | ${8.6}        | ${"AAA"}
    ${"#f6c"} | ${"#000"} | ${8}          | ${"AAA"}
    ${"#f69"} | ${"#000"} | ${7.6}        | ${"AAA"}
    ${"#f99"} | ${"#000"} | ${10.3}       | ${"AAA"}
    ${"#fc9"} | ${"#000"} | ${14.3}       | ${"AAA"}
    ${"#ff9"} | ${"#000"} | ${20}         | ${"AAA"}
    ${"#cf9"} | ${"#000"} | ${18.3}       | ${"AAA"}
    ${"#9f9"} | ${"#000"} | ${17.1}       | ${"AAA"}
    ${"#9fc"} | ${"#000"} | ${17.5}       | ${"AAA"}
    ${"#9ff"} | ${"#000"} | ${18.1}       | ${"AAA"}
    ${"#9cf"} | ${"#000"} | ${12.4}       | ${"AAA"}
    ${"#99f"} | ${"#000"} | ${8.4}        | ${"AAA"}
    ${"#c9f"} | ${"#000"} | ${9.6}        | ${"AAA"}
    ${"#f9f"} | ${"#000"} | ${11.3}       | ${"AAA"}
    ${"#f9c"} | ${"#000"} | ${10.7}       | ${"AAA"}
    ${"#fcc"} | ${"#000"} | ${14.8}       | ${"AAA"}
    ${"#ffc"} | ${"#000"} | ${20.4}       | ${"AAA"}
    ${"#cfc"} | ${"#000"} | ${18.7}       | ${"AAA"}
    ${"#cff"} | ${"#000"} | ${19.3}       | ${"AAA"}
    ${"#ccf"} | ${"#000"} | ${13.6}       | ${"AAA"}
    ${"#fcf"} | ${"#000"} | ${15.3}       | ${"AAA"}
    ${"#fff"} | ${"#000"} | ${21}         | ${"AAA"}
    ${"#ccc"} | ${"#000"} | ${13.1}       | ${"AAA"}
    ${"#999"} | ${"#000"} | ${7.4}        | ${"AAA"}
    ${"#666"} | ${"#000"} | ${3.7}        | ${0}
    ${"#333"} | ${"#000"} | ${1.7}        | ${0}
  `(
    `Given the colors are $color1 and $color2`,
    ({ color1, color2, expectedRatio, expectedScore }) => {
      describe(`when the WCAG contrast ratio score is evaluated`, () => {
        let score, ratio;
        beforeEach(() => {
          score = wcagScore(color1, color2);
          ratio = contrastRatio(color1, color2);
        });

        it(`should return a score of "${expectedScore}"`, () => {
          expect(score).toBe(expectedScore);
        });
        it(`should return a ratio of "${expectedRatio}"`, () => {
          expect(ratio.toFixed(1)).toBe(expectedRatio.toFixed(1));
        });
      });
    }
  );

  it("should tell if a tuple of colors is accessible or not", async () => {
    expect(isAccessible("#000", "#fff")).toBe(true);
    expect(isAccessible("#300", "#000")).toBe(false);
    expect(isAccessible("#96f", "#000")).toBe(true);
    expect(isAccessible("#96f", "#000", "AAA")).toBe(false);
    expect(isAccessible("#f60", "#000", "AAA")).toBe(true);
  });
});

describe(`Feature: color conversions`, () => {
  describe.each`
    name         | hex          | expectedRGB           | expectedHSL            | hsv
    ${"Black"}   | ${"#000"}    | ${[0, 0, 0, 1]}       | ${[0, 0, 0, 1]}        | ${[0, 0, 0]}
    ${"White"}   | ${"#FFF"}    | ${[255, 255, 255, 1]} | ${[0, 0, 100, 1]}      | ${[0, 0, 100]}
    ${"Red"}     | ${"#FF0000"} | ${[255, 0, 0, 1]}     | ${[0, 100, 50, 1]}     | ${[0, 100, 100]}
    ${"Lime"}    | ${"#00FF00"} | ${[0, 255, 0, 1]}     | ${[120, 100, 50, 1]}   | ${[120, 100, 100]}
    ${"Blue"}    | ${"#0000FF"} | ${[0, 0, 255, 1]}     | ${[240, 100, 50, 1]}   | ${[240, 100, 100]}
    ${"Yellow"}  | ${"#FFFF00"} | ${[255, 255, 0, 1]}   | ${[60, 100, 50, 1]}    | ${[60, 100, 100]}
    ${"Cyan"}    | ${"#00FFFF"} | ${[0, 255, 255, 1]}   | ${[180, 100, 50, 1]}   | ${[180, 100, 100]}
    ${"Magenta"} | ${"#FF00FF"} | ${[255, 0, 255, 1]}   | ${[300, 100, 50, 1]}   | ${[300, 100, 100]}
    ${"Silver"}  | ${"#C0C0C0"} | ${[192, 192, 192, 1]} | ${[0, 0, 75.3, 1]}     | ${[0, 0, 75]}
    ${"Gray"}    | ${"#808080"} | ${[128, 128, 128, 1]} | ${[0, 0, 50.2, 1]}     | ${[0, 0, 50]}
    ${"Maroon"}  | ${"#800000"} | ${[128, 0, 0, 1]}     | ${[0, 100, 25.1, 1]}   | ${[0, 100, 50]}
    ${"Olive"}   | ${"#808000"} | ${[128, 128, 0, 1]}   | ${[60, 100, 25.1, 1]}  | ${[60, 100, 50]}
    ${"Green"}   | ${"#008000"} | ${[0, 128, 0, 1]}     | ${[120, 100, 25.1, 1]} | ${[120, 100, 50]}
    ${"Purple"}  | ${"#800080"} | ${[128, 0, 128, 1]}   | ${[300, 100, 25.1, 1]} | ${[300, 100, 50]}
    ${"Teal"}    | ${"#008080"} | ${[0, 128, 128, 1]}   | ${[180, 100, 25.1, 1]} | ${[180, 100, 50]}
    ${"Navy"}    | ${"#000080"} | ${[0, 0, 128, 1]}     | ${[240, 100, 25.1, 1]} | ${[240, 100, 50]}
  `(
    `Given the hexadecimal representation of $hex`,
    ({ hex, hsv, expectedRGB, expectedHSL }) => {
      describe(`when the conversion is done`, () => {
        let rgb, hsl, rgbFromHsv;
        beforeEach(() => {
          rgb = convertColorToRGBA(hex);
          hsl = convertRGBAToHSLA(rgb);
          rgbFromHsv = convertHSVToRGB(hsv);
        });

        it(`should return a RGBA of "${expectedRGB}"`, () => {
          expect(rgb).toStrictEqual(expectedRGB);
        });

        it(`should return a HSLA of "${expectedHSL}"`, () => {
          expect(hsl).toStrictEqual(expectedHSL);
        });

        it(`should return a RGB of "${expectedRGB}"`, () => {
          expect(
            rgbFromHsv[0] <= expectedRGB[0] + 1 &&
              rgbFromHsv[0] >= expectedRGB[0] - 1
          ).toBe(true);
          expect(
            rgbFromHsv[1] <= expectedRGB[1] + 1 &&
              rgbFromHsv[1] >= expectedRGB[1] - 1
          ).toBe(true);
          expect(
            rgbFromHsv[2] <= expectedRGB[2] + 1 &&
              rgbFromHsv[2] >= expectedRGB[2] - 1
          ).toBe(true);
        });
      });
    }
  );

  it("should not attempt to convert a valid RGB array", async () => {
    let rgb;
    rgb = convertColorToRGBA([123, 123, 123]);
    expect(rgb).toStrictEqual([123, 123, 123]);
    rgb = convertColorToRGBA([123, 123, 123, 1]);
    expect(rgb).toStrictEqual([123, 123, 123, 1]);
  });

  it("should convert RGBA to HSLA", async () => {
    const hsl = convertRGBAToHSLA([123, 123, 123]);
    expect(hsl).toStrictEqual([0, 0, 48.2, 1]);
  });

  it("should throw if something else than a string or an array is passed as argument", async () => {
    expect(() => {
      convertColorToRGBA(42);
    }).toThrow();
  });
});

describe("when testing for individual utilities with no logging side-effects", () => {
  it("should return the same color if the same seed is used", async () => {
    const randomColor = new RandomColor();
    expect(randomColor.color("this-is-a-seed")).toBe("#a0caf2");
    expect(randomColor.color("this-is-another-seed")).toBe("#94b2f2");
  });

  it("should return a valid hexadecimal color", async () => {
    const re = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

    const randomColor = new RandomColor();
    expect(randomColor.color()).toMatch(re);

    const randomColor2 = new RandomColor({ color: "#ff0000" });
    expect(randomColor2.color()).toMatch(re);

    const randomColor3 = new RandomColor({ color: "monochrome" });
    expect(randomColor3.color()).toMatch(re);

    const randomColor4 = new RandomColor({ luminosity: "bright" });
    expect(randomColor4.color()).toMatch(re);

    const randomColor5 = new RandomColor({ luminosity: "dark" });
    expect(randomColor5.color()).toMatch(re);
  });

  it("should try many times before finding a valid accessible color", async () => {
    const re = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

    const randomColor = new RandomColor({
      backgroundColor: "#FFF",
      color: "#FFF",
    });
    expect(randomColor.color()).toMatch(re);
  });
});
