'use strict';
const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'frontend/src');

const config = {
    context: APP_DIR,
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        publicPath: "/"
    },
    //Apparently, to hack css loader
    //See: https://github.com/webpack-contrib/css-loader/issues/447
    node : {
        fs: 'empty'
    },
    //Add path aliases here for easier access in frontend imports
    resolve:{
        alias:{
            '@Routes' : path.resolve(__dirname,'frontend/src/routes'),
            '@Components' : path.resolve(__dirname,'frontend/src/components'),
            '@Services' : path.resolve(__dirname,'frontend/src/services'),
            '@Actions' : path.resolve(__dirname,'frontend/src/actions'),
            '@Containers' : path.resolve(__dirname,'frontend/src/containerclasses'),
            '@Stores' : path.resolve(__dirname,'frontend/src/stores'),
            '@Models' : path.resolve(__dirname,'frontend/src/models'),
            '@Utils' : path.resolve(__dirname,'frontend/src/utilities'),
        }
    },
    module: {
        rules: [
	    {
		test: /\.(png|jpg)$/,
		use: [{
		    loader: 'url-loader'
		}]
	    },
	    {
		test: /\.css$/,
		use: ["style-loader", "css-loader"]
        },
        {
            test: /\.svg$/,
            exclude: /node_modules/,
            use: {
                loader: 'svg-react-loader',
                options :
                {
                    xmlnsTest: /xmlns.*$/,
                }
            }
        }
        ]
    }
};

module.exports = config;

