const path = require("path");
const rimraf = require("rimraf");
const webpack = require("webpack");

const configFactory = require("./webpack.config");
const config = configFactory("production");

// console.dir(config, { depth: null });

rimraf(path.resolve(__dirname, "../dist"), error => {
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
