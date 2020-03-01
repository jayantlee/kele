"use strict";

const host = process.env.HOST || "0.0.0.0";

module.exports = (proxy, allowedHost) => {
  return {
    compress: true,
    hot: true,
    host,
    overlay: false,
    stats: "errors-only",
    // public: allowedHost,
    proxy,
  };
};
