const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const templatePath = __dirname + "/src/template/";
module.exports = {
	entry: {
			index: templatePath + "index.js"
		},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'index_bundle.[chunkhash].js'
	},
	
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader?minimize"
				})
			}
		]
	},
	
	plugins: [
		new HtmlWebpackPlugin({
			title: '按照ejs模板生成页面',
			filename: 'index.html',
			template: templatePath + 'index.ejs'
		}),
		new UglifyJSPlugin(),
		new ExtractTextPlugin({
			filename: "style/[name].css?[chunkhash]"
		})
	]
} 
