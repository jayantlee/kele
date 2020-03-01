const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(appDirectory, relativePath);
process.env.GENERATE_SOURCEMAP = false;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// const PATHS = {
//   src: path.join(__dirname, "../src"),
// };
module.exports = webpackEnv => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: {
          filename: "[name]_[contenthash:8].css",
          chunkFilename: "[name].chunk.css",
        },
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        loader: require.resolve("postcss-loader"),
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      });
    }

    return loaders;
  };

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
    entry: { index: resolvePath("src/index.ts") },
    output: {
      path: isEnvProduction ? resolvePath("dist") : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "static/js/[name]_[chunkhash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name]_[chunkhash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          // cache: true, // default
          // parallel: true, // default
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCssAssetsWebpackPlugin({
          // assetNameRegExp: /\.css$/g, // default
          // cssProcessor: cssnano, // default
          cssProcessorOptions: {
            map: shouldUseSourceMap
              ? {
                  inline: false, // 不生成内联映射而产生一个source-map文件
                  annotation: true, // 向css中注入source-map路径注释
                }
              : false,
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
      },
    },
    resolve: {
      // modules: ["node_modules"], // default
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
      alias: {
        "@": resolvePath("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: resolvePath("src"),
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
        {
          test: /\.vue$/,
          use: require.resolve("vue-loader"),
        },
        {
          test: /\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction && shouldUseSourceMap,
          }),
        },
        {
          test: /\.(scss|sass)$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              sourceMap: isEnvProduction && shouldUseSourceMap,
            },
            "sass-loader",
          ),
        },
        {
          test: /\.(bmp|gif|png|jpe?g)$/i,
          use: [
            {
              loader: require.resolve("url-loader"),
              options: {
                name: "static/media/[name]_[hash:8].[ext]",
                limit: 8192,
              },
            },
            {
              loader: require.resolve("image-webpack-loader"),
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
        {
          loader: require.resolve("file-loader"),
          exclude: [
            /\.(js|mjs|jsx|ts|tsx)$/,
            /\.vue$/,
            /\.css$/,
            /\.(scss|sass)$/,
            /\.(gif|png|jpe?g)$/i,
            /\.html$/,
            /\.json$/,
          ],
          options: {
            name: "static/media/[name].[hash:8].[ext]",
          },
        },
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            template: resolvePath("public/index.html"),
            filename: "index.html",
            inject: true,
            chunks: ["index", "vendors~index"],
          },
          isEnvProduction
            ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              }
            : undefined,
        ),
      ),
      new AddAssetHtmlPlugin({
        filepath: resolvePath("dll/*.dll.js"),
      }),
      new webpack.DllReferencePlugin({
        manifest: resolvePath("dll/venders_manifest.json"),
      }),
      isEnvDevelopment && new FriendlyErrorsPlugin(),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      // 和vue的scoped冲突
      // isEnvProduction && new PurgecssPlugin({
      //   paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      // }),
      // new webpack.ProvidePlugin({
      //   _join: ["lodash", "join"], // 遇到 _join 时加载 lodash.join
      // }),
    ].filter(Boolean),
  };
};
