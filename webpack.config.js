const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    // index: "./example/index.ts",
    simpleExample: "./example/simpleExample.ts",
  },
  output: {
    path: path.resolve(__dirname, './buildExample'),
    filename: "[name]-example.js" 
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};
