const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlTemplate = require('html-webpack-template');

module.exports = (env, argv) => {

  const { mode = 'development' } = argv;
  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      app: ['@babel/polyfill',  './index.ts']
    },
    output: {
      filename: 'js/[name].' + (mode === 'development' ? '' : '[chunkhash:6].') + 'js',
      path: path.resolve(__dirname, 'dist'),
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
      contentBase: path.join(__dirname, "dist")
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, 'dist/index.html'),
        inject: false,
        template: htmlTemplate,
        title: 'GeoPort',
        appMountIds: ['heatmap','container'],
        scripts: ['cesium/Cesium.js']
      })
    ],
  };
}