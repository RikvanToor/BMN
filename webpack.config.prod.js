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
    plugins: [
        new webpack.DefinePlugin({
	    'process.env': {
		'NODE_ENV': JSON.stringify('production')
	    }
        }),
        new webpack.optimize.UglifyJsPlugin(),
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
