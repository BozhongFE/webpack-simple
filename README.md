# BozhongFE/webpack-simple

Fork from [vuejs-templates/webpack-simple](https://github.com/vuejs-templates/webpack-simple)

### Usage

This is a project template.

``` bash
$ npm install -g vue-cli
$ vue init BozhongFE/webpack-simple my-project
// or $ vue init BozhongFE/webpack-simple#v0.2.0 my-project
$ cd my-project
$ npm install
$ npm run dev
```

### What's Included

- `npm run dev`: Webpack + `vue-loader` with proper config for source maps & hot-reload.

- `npm run build`: build with HTML/CSS/JS minification.

### HISTORY

|#|标签|日期|开发内容|
|---|---|---|---|
|#|v0.1.0|20180510|fork from [vuejs-templates/webpack-simple](https://github.com/vuejs-templates/webpack-simple)
|#|v0.1.0|20180510|依赖调整、sass更换成less、新增reset.css、打包输出到source;
|#|v0.1.0|20180530|新增html-webpack-plugin;
|#|v0.1.0|20180612|新增重定向后basehref/脚本引用相关;
|#|v0.1.0|20180615|新增webpack-bundle-analyzer;
|#|v0.2.0|20180627|内置HtmlAutoDomainWebpackPlugin插件优化
|#|v0.3.0|20180629|摘除HtmlAutoDomainWebpackPlugin，相应功能由html-webpack-plugin实现
|#|v0.3.1|20180702|修复html-webpack-plugin开发/生产环境不同配置问题
|#|v0.4.0|20180702|开发环境自动匹配本机ip，port写定8000
