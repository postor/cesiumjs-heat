const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'src', 'lib', 'CesiumHeat.js'),
  output: {
    library: 'getCesiumHeat',
    libraryTarget: 'umd',
    filename: 'get-cesium-heat.umd.js',
    path: join(__dirname, 'build')
  }
};