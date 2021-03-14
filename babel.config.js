module.exports = function (api) {
  api.cache(true);
  return {
    env: {
      production: {
        plugins: ["@babel/plugin-transform-modules-commonjs"],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
        ],
      },
      test: {
        plugins: [
          "@babel/plugin-transform-modules-commonjs",
          "@babel/plugin-transform-runtime",
        ],
        presets: [
          [
            "@babel/preset-env",
            {
              modules: false,
            },
          ],
        ],
      },
    },
  };
};
