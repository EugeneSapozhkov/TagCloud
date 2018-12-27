const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: "./App.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "app.js",
		publicPath: "/dist"
	},
	devServer: {
		hot: false,
		disableHostCheck: true,
		historyApiFallback: true,
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.json'],
		modules: [
			path.resolve('./src/'),
			path.resolve('./node_modules'),
			'node_modules',
		]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					{loader: "style-loader"},
					{loader: "css-loader"},
					{loader: "sass-loader"}
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
};