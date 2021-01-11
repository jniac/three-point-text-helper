const path = require('path');

module.exports = {
  entry: {
    'vertices': './src/vertices.ts',
    'vertices-stress': './src/vertices-stress.ts',
    'vertices-knot': './src/vertices-knot.ts',
    'vertices-hello': './src/vertices-hello.ts',
  },
  mode: 'production',
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
    hints: false,
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
};