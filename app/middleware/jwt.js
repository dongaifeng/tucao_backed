'use strict';

const jwt = require('jsonwebtoken');

module.exports = app => {
  return async function verify(ctx, next) {

    // 判断没有token 证明用户没有登录
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -666,
        message: '用户没有登录',
      };
      return;
    }

    // 获取token
    const token = ctx.request.header.authorization.replace('Bearer ', '');
    try {
      // 解析token
      const res = await jwt.verify(token, app.config.jwt.secret);

      // 保存用户状态
      ctx.state.email = res.email;
      ctx.state._id = res._id;
      await next();

    } catch (e) {
      console.log('错误信息', e);
      if (e.name === 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '登录过期',
        };
      } else {
        ctx.body = {
          code: -1,
          message: '验证错误',
        };
      }
    }
  };
};