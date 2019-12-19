const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'src', 'lib', 'CesiumHeat.js'),
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
  output: {
    library: 'getCesiumHeat',
    libraryTarget: 'umd',
    filename: 'get-cesium-heat.umd.js',
    path: join(__dirname, 'build')
  }
};