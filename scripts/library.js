const path = require("path");
const rimraf = require("rimraf");
const webpack = require("webpack");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const config = {
  mode: "none",
  entry: {
    kele: path.resolve(__dirname, "../src/common/index.ts"),
    "kele.min": path.resolve(__dirname, "../src/common/index.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../library"),
    library: "kele",
    libraryTarget: "umd",
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: [
          require.resolve("thread-loader"),
          {
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  externals: ["lodash"], // 打包忽略依赖库
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
};

rimraf(path.resolve(__dirname, "../library"), error => {
  if (error) throw error;
  webpack(config, (err, stats) => {
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      }) + "\n\n",
    );
  });
});
