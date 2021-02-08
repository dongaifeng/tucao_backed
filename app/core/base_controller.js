
'use strict';
const { Controller } = require('egg');

/** 状态
 *  success 请求成功
 *  error   请求出错
 * no-login  没有登录
 * timeout  token过期
 * no-user  没有用户信息
 */

const codeType = {
  success: 'success',
  error: 'error',
  noLogin: 'no-login',
  timeout: 'timeout',
  noUser: 'no-user'
}

class BaseController extends Controller {

  static codeType = codeType;

  get user() {
    return this.ctx.session.user;
  }

  success(data, msg) {
    this.ctx.body = {
      code: codeType.success,
      message: msg || '请求成功',
      data,
    };
  }

  error(message = '请求出错', errors = {}, code = codeType.error) {
    this.ctx.body = {
      code,
      message,
      errors,
    };
  }

  noLogin() {
    this.ctx.body = {
      code: codeType.noLogin,
      data: null,
      message: '用户没有登录',
    };
  }

  tokenOut() {
    this.ctx.body = {
      code: codeType.timeout,
      data: null,
      message: '登录过期，请重新登录',
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  msg(message) {
    this.ctx.body = {
      code: codeType.success,
      data: message,
      message,
    };
  }

 
}

module.exports = BaseController;
