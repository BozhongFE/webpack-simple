const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;{{#htmlwebpackPlugin}}
const HtmlWebpackPlugin = require('html-webpack-plugin');{{/htmlwebpackPlugin}}{{#less}}
const autoprefixer = require('autoprefixer');{{/less}}{{#redirected}}
const jsdom = require('jsdom');{{/redirected}}{{#if_or redirected source}}
const fs = require('fs');
{{/if_or}}
{{#source}}

const sourcePath = process.env.npm_config_source;

if (typeof sourcePath === 'undefined') {
  console.log('请先配置打包输出的source根目录');
  console.log('Example: npm config set source "D:\\source"');
  throw new Error('没有配置模块路径');
} else if (!fs.existsSync(sourcePath)) {
  throw new Error('source根目录不存在，请检查配置的source根目录是否正确');
}
{{/source}}
{{#redirected}}
// 给插入html的js加版本号
class HtmlAutoDomainWebpackPlugin {
  constructor (options) {
    const obj = {};
    for (let i in options) {
      if (Object.prototype.toString.call(options[i]) === '[object Object]') {
        const key = options[i].filename;
        if (key) {
          obj[key] = {};
          if (options[i].chunks) {
            const chunks = options[i].chunks;
            for (let j in chunks) {
              obj[key][chunks[j]] = j;
            }
          }
        }
      }
    }
    this.options = obj;
  }
  apply(compiler) {
    const configs = this.options;
  
    compiler.plugin('compile', (params) => {
    });
    compiler.plugin('compilation',  (compilation) => {
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        const files = {};
        chunks.forEach((chunk) => {
          if (chunk.name) {
            chunk.files.forEach((file) => {
              // 只筛选所有页面公用部分
              for (let key in configs) {
                console.log(configs, key)
                if (configs[key].hasOwnProperty(file.match(/(.+).js/)[1])) {
                  if (!files[key]) files[key] = [];
                  files[key].push(file);
                }
              }
            });
          }
        });
        console.log(files)
        for (let key in files) {
          const source = fs.readFileSync(path.resolve(__dirname, `./src/${key}`), 'utf-8');
          const config = configs[key];
          files[key].sort((a, b) => {
            let aName = a.match(/(.+).js/);
            let bName = b.match(/(.+).js/);
            if (aName.length >= 1) {
              aName = aName[1];
            }
            if (bName.length >= 1) {
              bName = bName[1];
            }
            return config[aName] > config[bName];
          });
          compilation.assets[`./${key}`] = {
            source() {
              const dom = new jsdom.JSDOM(source);
              const script = dom.window.document.createElement('script');
              // console.log(files);
              const hash = files[key][0].match(/\?(.+)/);
              let html = `var hash = '${hash && hash[1] ? hash[1] : ''}';`;
              html += `var files = ${JSON.stringify(files[key])};`;
              script.innerHTML += html;
              dom.window.document.querySelector('head').appendChild(script)
              return dom.serialize();
            },
            size() {
              return source.length;
            },
          };
        };
        callback();
      })
    })
  }
}
{{/redirected}}


module.exports = {
  {{#if_eq htmlwebpackPlugin false}}
  entry: './src/main.js',
  {{/if_eq}}{{#htmlwebpackPlugin}}
  entry: {
    main: './src/main.js',
  },
  {{/htmlwebpackPlugin}}
  output: {
    {{#source}}
    // 按项目路径修改打包输出的路径_filePath，如activity/health，_filepath改成'./activity/health'
    path: path.resolve(sourcePath, '_filePath'),
    {{/source}}{{#if_eq source false}}
    path: path.resolve(__dirname, './dist'),
    {{/if_eq}}{{#if_eq htmlwebpackPlugin false}}
    publicPath: '/dist/',
    filename: 'build.js',
    {{/if_eq}}{{#htmlwebpackPlugin}}
    filename: process.env.NODE_ENV === 'production' ? '[name].js?[chunkhash]' : '[name].js',
    {{/htmlwebpackPlugin}}
    chunkFilename: '[id].js?[chunkhash]',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          {{#less}}
          postcss: [autoprefixer({
            browsers: ['iOS >= 8', 'Android >= 4.1'],
          })],
          {{/less}}
          // other vue-loader options go here
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {{#less}}
      // 需单独打包↓↓
      // {
      //   test: /\.less$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use:[
      //       'css-loader?-autoprefixer',
      //       'less-loader',
      //     ],
      //   }),
      // },
      {{/less}}
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 12 * 1024,
          name: './images/[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      src: path.resolve(__dirname, './src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',{{#htmlwebpackPlugin}}
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['main'],
    }),
  ]{{/htmlwebpackPlugin}}
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map',
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new BundleAnalyzerPlugin(),
    {{#redirected}}
    // 给html注入的js加版本号，用于重定向时文件引入
    new HtmlAutoDomainWebpackPlugin([
      {
        filename: 'index.html',
        chunks: ['main'],
      },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: [],
    }),
    {{/redirected}}
  ])
}
