'use strict';
const path = require('path');

module.exports = appInfo => {

  console.log('appInfo----->', appInfo)

  const config = exports = {};
  config.multipart = {
    mode: 'file'
  };

  config.static = { 
    prefix: '/public/', // 设置静态文件 请求时的前缀
    dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'app/view')]// 多静态文件入口
  };
  

  config.cluster = {
    listen: {
      path: '',
      port: 7000,
      hostname: '0.0.0.0',
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'daf';

  config.view = {
    // root: '', // 模板文件的根目录，为绝对路径，默认为 ${baseDir}/app/view。支持配置多个目录，以 , 分割，会从多个目录查找文件。
    // cache: true, // 模板路径缓存，默认开启。框架会根据 root 配置的目录依次查找，如果匹配则会缓存文件路径，下次渲染相同路径时不会重新查找。
    // defaultViewEngine: 'nunjucks',  // 可以做全局配置。如果根据文件后缀没有找到对应的模板引擎，会使用默认的模板引擎进行渲染。
    // defaultExtension: '.nj', // 一般在调用 render 时的第一个参数需要包含文件后缀，如果配置了 defaultExtension 可以省略后缀。
    mapping: {
      '.html': 'nunjucks',  // 指定以.html的后缀名的 模板，用nunjucks去解析。
    },
  };

  config.news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
  };


  config.robot = {
    ua: [
      /curl/i,
      /Baiduspider/i,
    ],
  };

  config.cors = {
    // origin: 'http://47.105.185.203:8091',
    origin: 'http://localhost:3000',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // domainWhiteList: [ 'http://localhost:3000' ],
  };

  // config.mysql = {
  //   // 单数据库信息配置
  //   client: {
  //     host: '8.141.49.190',
  //     port: '3306',
  //     user: 'root',
  //     password: '0518',
  //     database: 'tucao',
  //   },
  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false,
  // };


  config.middleware = [ 'log', 'robot', 'error' ];

  const userConfig = {
    // myAppName: 'egg',
    error: {
      match: '/api',
    },

    jwt: {
      secret: 'dongaifeng',
      expiresIn: '100h'
    },
    qq: {
      host: 'smtp.qq.com',
      secureConnection: true,
      port: '465',
      auth: {
        user: 'dong.aifeng@qq.com',
        pass: 'lryurnzisadfbcea',
      }
    },
    alinode: {
      // 从 `Node.js 性能平台` 获取对应的接入参数
      appid: '87526',
      secret: '9d41f222a26010f72ac22894652bc4065546f6e5',
    },

    uploaddir: path.resolve(__dirname, '../', 'app/public/uploads/'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
