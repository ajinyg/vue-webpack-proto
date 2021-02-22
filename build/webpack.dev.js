const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const devConfig = {
	mode: 'development',
	devServer:{
		publicPath: '/',
		contentBase:'./dist',
		open:true,
		port:8080,
		hot:true,
		hotOnly:true,
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin()
	],
	devtool:'cheap-module-source-map'
}
module.exports = merge(commonConfig,devConfig)