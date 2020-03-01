const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const configFactory = require("./webpack.config");
const createDevServerConfig = require("./webpack-dev-server.config");

const serverConfig = createDevServerConfig();
console.dir(serverConfig, { depth: null });

const devServer = new WebpackDevServer(webpack(configFactory("development")), serverConfig);

const PORT = process.env.HOST || 8080;
const HOST = process.env.HOST || "0.0.0.0";
// Launch WebpackDevServer.
devServer.listen(PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }

  // console.log(chalk.cyan("Starting the development server...\n"));
});

["SIGINT", "SIGTERM"].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});
