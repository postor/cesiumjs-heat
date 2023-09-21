const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'src', 'lib', 'CesiumHeat.js'),
  output: {
    libraryTarget: 'commonjs',
    filename: 'get-cesium-heat.cmd.js',
    path: join(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: {
    'heatmap.js': 'heatmap.js'
  },
  devtool: 'source-map'
};