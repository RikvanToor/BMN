'use strict';
const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const common = require('./webpack.config.common.js');

//const BUILD_DIR = path.resolve(__dirname, 'frontend/public/js');
//Let's build to public so that Lumen can serve it.
const BUILD_DIR = path.resolve(__dirname, 'public/js');

const config = {
    mode: 'production',
    output: {
        path: BUILD_DIR
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, //Check for all js files
                exclude: /node_modules/,
                loader: 'babel-loader?-babelrc,+cacheDirectory,presets[]=es2015,presets[]=stage-0,presets[]=react',
                query: { presets: ['es2015', 'react'] }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 8192, // Convert images < 8kb to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    } 
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
	    'process.env': {
	        'NODE_ENV': JSON.stringify('production')
	    }
	})
    ]
};

module.exports = webpackMerge(common, config);

