'use strict';
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/js');
const APP_DIR = path.resolve(__dirname, 'frontend/src');

const config = {
    context: APP_DIR,
    entry: {
        app: './index.js'
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //Check for all js files
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react',
                }]
            },
	    {
		test: /\.(png|jpg)$/,
		use: [{
		    loader: 'url-loader'
		}]
	    },
	    {
		test: /\.css$/,
		use: ["style-loader", "css-loader"]
	    }
        ]
    },
    devServer: {
        contentBase: __dirname + '/public/js'
    },
    devtool: "eval-source-map"
};

module.exports = config;

