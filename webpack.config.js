const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => {

  const { mode = 'development' } = argv;
  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: ['@babel/polyfill', './index.ts']
    },
    output: {
      filename: 'js/[name].' + (mode === 'development' ? '' : '[chunkhash:6].') + 'js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    externals: {
      cesium: 'Cesium'
    },
    module: {
      rules: [{
        test: /\.ts$/,
        use: ['ts-loader']
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      }]
    },
    devServer: {
      static: path.join(__dirname, "dist")
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
        title: 'GeoPort',
        scripts: ['cesium/Cesium.js']
      })
    ],
  };
}