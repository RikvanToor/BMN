'use strict';
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); 
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common.js');

const BUILD_DIR = path.resolve(__dirname, 'public/js');

console.log("Running production build");

const config = {
    output: {
        path: BUILD_DIR
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //Check for all js files
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react',
                }]
            }
        ]
    },
    optimization: {
      minimize: true,
      runtimeChunk: true,
      splitChunks: {
	chunks: "async",
        minSize: 1000,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          }
        }
      }
    },
    plugins: [
        new webpack.DefinePlugin({
	    'process.env': {
		'NODE_ENV': JSON.stringify('production')
	    }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
//         new CompressionPlugin({
//             asset: "[path].gz[query]",
//             algorithm: "gzip",
//             test: /\.js$|\.css$|\.html$/,
//             threshold: 10240,
//             minRatio: 0.8
//         }),
        new CleanWebpackPlugin(BUILD_DIR, [])
    ],
    devServer: {
        contentBase: __dirname + '/public/js'
    },
    devtool: "eval-source-map"
};

module.exports = webpackMerge(common, config);
