'use strict';

exports.mysql = {
  // 单数据库信息配置
  client: {

    host: '8.141.49.190',
    port: '3306',
    user: 'root',
    password: '0518',
    database: 'tucao',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};



  exports.onerror = {
    errorPageUrl: '/50x.html',
    
    all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.body = 'error';
      ctx.status = 500;
    },
    html(err, ctx) {
      // html hander
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { message: 'error-----', err};
      ctx.status = 500;
    },
   
  }


// exports.cors = {
//   origin: 'http://localhost:3000',
//   credentials: true,
//   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
// };

// exports.security = {
//   csrf: {
//     enable: false,
//     ignoreJSON: true,
//   },
//   domainWhiteList: [ 'http://localhost:3000' ],
// };
