const path = require("path");
const webpack = require("webpack");

const config = {
  mode: "production",
  entry: {
    venders: ["vue"],
    // venders: ["react", "react-dom"],
  },
  output: {
    filename: "[name]_[chunkhash:8].dll.js",
    path: path.join(__dirname, "../dll"),
    library: "[name]_[chunkhash:8]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_[chunkhash:8]",
      path: path.join(__dirname, "../dll/[name]_manifest.json"),
    }),
  ],
};

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
