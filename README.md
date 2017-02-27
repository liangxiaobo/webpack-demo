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
