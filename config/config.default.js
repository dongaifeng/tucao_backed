/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.cluster = {
    listen: {
      path: '',
      port: 7002,
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


  // add your middleware config here
  config.middleware = [ 'robot', 'error' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    error: {
      match: '/api',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
