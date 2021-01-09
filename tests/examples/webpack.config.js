const path = require('path');

module.exports = {
  entry: {
    vertices: './src/vertices/index.ts'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    maxEntrypointSize: 1000000,
  },
  resolve: {
    extensions: ['.tsx','.ts','.js'],
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
	devServer: {
		host: 'localhost',
		port: 8888,
		publicPath: "/",
    disableHostCheck: true,
  },
  watch: true,
};