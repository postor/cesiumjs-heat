const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'src', 'lib', 'CesiumHeat.js'),
  output: {
    library: 'getCesiumHeat',
    libraryTarget: 'commonjs2',
    filename: 'get-cesium-heat.cmd.js',
    path: join(__dirname, 'build')
  },
  externals: {
    'heatmap.js': 'heatmap.js'
  },
  devtool: 'source-map'
};