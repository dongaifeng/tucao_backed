'use strict';
const path = require('path');

module.exports = appInfo => {

  const config = exports = {};
  config.multipart = {
    mode: 'file'
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
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
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



  config.middleware = [ 'robot', 'error' ];

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
    uploaddir: path.resolve(__dirname, '../', 'app/public/uploads/'),
  };

  return {
    ...config,
    ...userConfig,
  };
};
