'use strict';

exports.mysql = {
  // 单数据库信息配置
  client: {

    host: '47.105.185.203',
    port: '3306',
    user: 'root',
    password: 'mimashi123',
    database: 'dongaf',


  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};

// exports.cors = {
//   origin: '*',
//   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
// };

// exports.security = {
//   csrf: {
//     enable: false,
//     ignoreJSON: true,
//   },
//   domainWhiteList: [ 'http://localhost:3000' ],
// };
