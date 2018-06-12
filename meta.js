
const {
  printMessage,
} = require('./utils');

module.exports = {
  helpers: {
    if_or (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  },
  prompts: {
    name: {
      type: 'string',
      required: true,
      label: 'Project name'
    },
    description: {
      type: 'string',
      required: true,
      label: 'Project description',
      default: 'A Vue.js project'
    },
    author: {
      type: 'string',
      label: 'Author'
    },
    license: {
      type: 'string',
      label: 'License',
      default: 'MIT'
    },
    less: {
       type: 'confirm',
       message: 'Use less?',
       default: false
    },
    htmlwebpackPlugin: {
       type: 'confirm',
       message: 'Use html-webpack-plugin?',
       default: false
    },
    redirected: {
      when: 'htmlwebpackPlugin',
      type: 'confirm',
      message: 'Will be redirected?',
      default: false
    },
    source: {
      type: 'confirm',
      message: 'output to source repository?',
      default: false
    },
  },
  filters: {
    'src/index.html': 'htmlwebpackPlugin',
    'index.html': '!htmlwebpackPlugin'
  },
  complete(data) {
    let tips = '';
    if (data.inPlace) {
      tips += '\n   To get started:\n\n     npm install\n     npm run dev';
    } else {
      tips += `\n   To get started:\n\n     cd ${data.destDirName}\n     npm install\n     npm run dev`
    }
    if (data.source) tips += '\n     check ./webpack.config.js output.path';
    if (data.redirected) tips += '\n     check ./src/index.html baseHref.href';
    
    console.log(tips)
  }
}
