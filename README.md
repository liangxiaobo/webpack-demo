# webpack-demo
- 学习如何使用webpack2 生成一个html
- 压缩js、css并引用到页面

npm 的镜像修改成**cnpm**淘宝的镜像 http://npm.taobao.org

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

```bash
npm install --save-dev webpack
```

### 第三步 创建package.json

```bash
npm init -y
# 也可以用 npm init 按照步骤一步一步往下走
```
之后，根目录下会多一个文件package.json

```javascript
/*
 * webpack 的命令在执行的时候应该是 webpack --config webpack.config.js 需要带上你的webpack.config.js
 * 当你单独执行webpack命令时，webpack找你根目录的webpack.config.js 
 * 如果你用npm install --save-dev webpack 安装webpack时你应该用 
 * ./node_modules/.bin/webpack --config webpack.config.js
 * package.json中的script 中会自动加上前缀 ./node_modules/.bin 所以 script 里的 webpack 
 * 就是你项目本身的webpack
 */
"scripts": {
    "dev": "webpack --config dev.webpack.config.js",         // 开发时的执行 npm run dev 
    "release": "webpack --config release.webpack.config.js", // 发布生产时的执行 npm run release 
}
```

index.ejs的内容：
```html
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
```bash
npm install --save-dev html-webpack-plugin
```
**webpack-config.js**

```javascript
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
**执行命令 **
```
webpack
```
**build目录结构：**
```
├── index_bundle.9c7e5a148ecac4e50789.js
└── index.html

```
build/index.html
```html
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
```javascript
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
```javascript
/*随便写点js用来测试*/
(function(){
        window.onload = function(){
                console.log("调用onload事件");
                alert("页面加载的时候弹出来");
        }
})()

```
生成后的文件build/index.js
```javascript
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
```javascript
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
```html
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
```css
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

### url-loader 可以把图片较小的显示成base64格式 来减少http请求
先在imgs下添加两张图片
```
├── a.jpg // size:341407 byte
└── timg.jpg // size: 28616 byte
```
在webpack.config.js module里添加:
```javascript
 module: {
                rules: [
                        {
                                test: /\.css$/,
                                loader: ExtractTextPlugin.extract({
                                        fallback: "style-loader",
                                        use: "css-loader?minimize"
                                })
                        },
                        {
                                test: /\.(png|jpg|gif)$/,
                                loader: 'url-loader?limit=30000&name=./imgs/[hash].[ext]'
                        }       
                ]
        },
        
```
先安装 url-loader file-loader
``
npm install --save-dev url-loader file-loader 
``
limit 是指小于30000byte图片将转换成base64，否则的话，将图片打包到buile/imgs下面，ext是指文件的后缀（jpb,gif等）

index.ejs内容添加：
```html
<img src="<%= require('../imgs/timg.jpg') %>" />
<img src="<%= require('../imgs/a.jpg') %>" />

```
执行 webpack 后 build目录, 发现少了一张图片
```
├── imgs
│   └── c71f11e055fad46906a7e52d321d4785.jpg
├── index_bundle.0fac93adc8b2e76b43e9.js
├── index.html
└── style
    └── index.css
```
来看生成的index.html内容:
```html
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

    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAKAAn8DASIAAhEBAxEB/8QAHAAAAgMBAQEBAAAAAAAAAAAAAgMAAQQFBgcI/8QAPBAAAgIBBAAFAwIEBAUDBQEAAAECEQMEEiExBRMiQVEyYXEGFEJSgZEjobHBBxUzYvAkctElQ1OC4fH/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAJREBAQACAgICAwADAQEAAAAAAAECEQMhEjEEEyJBUTJhcRQF/9oADAMBAAIRAxEAPwD7S3YpyDYifEzm8jNXIaQuAwcJdUVJF38lNlALRVF2VySBQhbG1RIKollyGpIv2J7lplQlFlEGayEIMkIQsAososYQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBCEIAQhCAEIQgBKKaLIAAyldhtEojxAWy0RotBIa6IQhZIQhA0EKZZKECpIXKNoe0BLgxyxMhqhc3S7JlyVZlyZb4ObIFZ5vfUfc1aTFS3Mz4qnOzp4klEWM7NaSoCeCGT6ojPcJGkgrL+yhK9rlH8Mz5tBlgnLHnl+GdZLgXkKywkgcPG9XCfrpo2YssmvUjUsKctxWTDTuKI8bAFSi+0DNwRNrQMlaDYJyZow5bKxa7Hdbl/cTqcdpnC1MHCbp0TcrA9dDU4mvrj/AHClqca6dnh/OyrhTkHDWZovibCcug9hLJudlbjzeLX513KzXDxCdcof2wnaUgrOOvEUu0xuPxTDJ05U/uHnKHQYjL0wf3mGS4nERl1MP5kFsNl1KMnTdGjLlg/ezPVu0ZUq9fJ0m2Z73SsLI2/cBd/B1Fs+K6DoTG19w02OAXJLZajJkpp8jCJWMUSRCLkNC6KLLhVVFS+wRQUQKkTc/gjXJEiQJSssFdhouBCEIMIQhACEIQAhCEAIQhACEIQAhCEQBCyEYBRCFgFFkIAQhCAEKLIAQhCAEIQgBRCyAFUQhYBCiygCEIQAhLIC2K3QRsVllSJKVK2zDnz9生成的有点长，后面的被我删除了" />
    <img src="./imgs/c71f11e055fad46906a7e52d321d4785.jpg" />    
  <script type="text/javascript" src="index_bundle.0fac93adc8b2e76b43e9.js"></script></body>
</html>

```
结束
