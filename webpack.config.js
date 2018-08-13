'use strict';
const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'frontend/public/js');
const APP_DIR = path.resolve(__dirname, 'frontend/src');

const config = {
    mode: 'production',
    context: APP_DIR,
    entry: './index.js',
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
		loader: 'babel-loader',
		query: { presets: [ 'es2015', 'react' ] }
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
        contentBase: __dirname + '/frontend/public',
	compress: true,
	port: 9000
    }
};

module.exports = config;

