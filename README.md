# webpack-demo
- 学习如何使用webpack2 生成一个html
- 压缩js、css并引用到页面

### 第一步 准备一下所需要的文件，目录结构

```
├── build // 存放打包后的文件
├── src // 源文件
│   ├── imgs
│   └── template
│       ├── index.css
│       ├── index.ejs
│       └── index.js
└── webpack.config.js //webpack的配置文件
```

### 第二步 安装 webpack

```
npm install --save-dev webpack
```

### 第三步 创建package.json

```
npm init -y
```
之后，根目录下会多一个文件package.json

index.ejs的内容：
```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
    <title><%= htmlWebpackPlugin.options.title %></title>

  </head>
  <body>
    <h1>这是一个用<b>html-webpack-plugin</b>生成的HTML页面</h1>


  </body>
</html>

```
安装 html-webpack-plugin 插件 https://www.npmjs.com/package/html-webpack-plugin
```
npm install --save-dev html-webpack-plugin
```
### webpack-config.js

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const templatePath = __dirname + "/src/template/";
module.exports = {
        entry: templatePath + "index.js",
        output: {
                path: path.join(__dirname, 'build'),
                filename: 'index_bundle.[chunkhash].js'
        },

        plugins: [
                new HtmlWebpackPlugin({
                        title: '按照ejs模板生成页面',
                        filename: 'index.html',
                        template: templatePath + 'index.ejs'
                })
        ]
}

```
执行  
```
webpack
```
目录结构：
```
├── index_bundle.9c7e5a148ecac4e50789.js
└── index.html

```
build/index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
    <title>按照ejs模板生成页面</title>

  </head>
  <body>
    <h1>这是一个用<b>html-webpack-plugin</b>生成的HTML页面</h1>


  <script type="text/javascript" src="index_bundle.9c7e5a148ecac4e50789.js"></script></body>
</html>

```
js已经被引用到页脚了

### 安装 js压缩插件 uglifyjs-webpack-plugin 
```
npm install --save-dev uglifyjs-webpack-plugin
```
### webpack.config.js配置修改：
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const templatePath = __dirname + "/src/template/";
module.exports = {
        entry: templatePath + "index.js",
        output: {
                path: path.join(__dirname, 'build'),
                filename: 'index_bundle.[chunkhash].js'
        },

        plugins: [
                new HtmlWebpackPlugin({
                        title: '按照ejs模板生成页面',
                        filename: 'index.html',
                        template: templatePath + 'index.ejs'
                }),
                new UglifyJSPlugin()
        ]
}

```
看index.js的源码
```
/*随便写点js用来测试*/
(function(){
        window.onload = function(){
                console.log("调用onload事件");
                alert("页面加载的时候弹出来");
        }
})()

```
生成后的文件build/index.js
```
!function(n){function t(r){if(o[r])return o[r].exports;var e=o[r]={i:r,l:!1,exports:{}};return n[r].call(e.exports,e,e.exports,t),e.l=!0,e.exports}var o={};return t.m=n,t.c=o,t.i=function(n){return n},t.d=function(n,o,r){t.o(n,o)||Object.defineProperty(n,o,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var o=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(o,"a",o),o},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(n,t){!function(){window.onload=function(){console.log("调用onload事件"),alert("页面加载的时候弹出来")}}()}]);

```

### 下面也看看css的压缩，以及在页面里的Link 
需要用到 extract-text-webpack-plugin 插件
```
npm install --save-dev extract-text-webpack-plugin
```
以及安装 css-loader 、 style-loader
```
npm install css-loader style-loader --save-dev
```
### webpack.config.js修改
```
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

```
生成后build的目录结构
```
├── index_bundle.0fac93adc8b2e76b43e9.js
├── index.html
└── style
    └── index.css
```
build/inde.html的代码：
```
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
    <title>按照ejs模板生成页面</title>

  <link href="style/index.css?0fac93adc8b2e76b43e9" rel="stylesheet"></head>
  <body>
    <h1>这是一个用<b>html-webpack-plugin</b>生成的HTML页面</h1>


  <script type="text/javascript" src="index_bundle.0fac93adc8b2e76b43e9.js"></script></body>
</html>

```
页面里已经引用了link

### 看看生成前后的index.css的对比
源码：
```
/*随便写点css*/
body{
        background: red;
}
body {font-size: 2em;}

```
打包后的代码(我写的css代码有点少，他把body样式合并成一个块了)：
```
body{background:red;font-size:2em}

```
