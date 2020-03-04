module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false, // 对ES6的模块文件不做转化，以便进行 tree shaking 和 sideEffects
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
  plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-proposal-class-properties"],
};
