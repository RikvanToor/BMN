'use strict';
const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common.js');

//const BUILD_DIR = path.resolve(__dirname, 'frontend/public/js');
//Let's build to public so that Lumen can serve it.
const BUILD_DIR = path.resolve(__dirname, 'public/js');

const config = {
    mode: 'development',
    output: {
        path: BUILD_DIR
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //Check for all js files
                exclude: /node_modules/,
		loader: 'babel-loader',
		query: { presets: [ 'es2015', 'react' ] }
            }
        ]
    },
    devServer: {
        contentBase: __dirname + '/frontend/public',
	compress: true,
	port: 9000
    }
};

module.exports = webpackMerge(common,config);

