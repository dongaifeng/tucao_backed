'use strict';

const jwt = require('jsonwebtoken');

const BaseController = require('../core/base_controller');
// const baseFn = new BaseController();

module.exports = app => {
  return async function verify(ctx, next) {

    // 判断没有token 证明用户没有登录
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: BaseController.codeType.noLogin,
        data: null,
        message: '用户没有登录',
      };
      return;
    }

    // 获取token
    const token = ctx.request.header.authorization.replace('Bearer ', '');


    // console.log(ctx.request.header.authorization, token)
    try {
      // 解析token
      const res = await jwt.verify(token, app.config.jwt.secret);

      // 保存用户状态
      ctx.state.email = res.email;
      ctx.state._id = res._id;
      await next();

    } catch (e) {
      // console.log('错误信息', e);
      if (e.name === 'TokenExpiredError') {
        ctx.body = {
          code: BaseController.codeType.timeout,
          message: '登录过期，请重新登录',
        };
      } else {
        ctx.body = {
          code: BaseController.codeType.error,
          message: e.message || 'token信息验证错误',
        };
      }
    }
  };
};