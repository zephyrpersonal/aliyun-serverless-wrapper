import path from "path"
import webpack from "webpack"

const config: webpack.Configuration = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.ts"),
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "commonjs"
  }
}

export default config
