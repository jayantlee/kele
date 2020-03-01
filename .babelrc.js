module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: {
          version: 3,
          proposals: true,
        },
        targets: {
          chrome: "67",
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: ["@babel/plugin-syntax-dynamic-import"],
};
