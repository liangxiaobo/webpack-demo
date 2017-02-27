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
