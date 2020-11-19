
'use strict';
const { Controller } = require('egg');

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      code: 2000,
      message: '请求成功',
      data,
    };
  }

  error(message = '请求出错', code = -1, errors = {}) {
    this.ctx.body = {
      code,
      message,
      errors,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  msg(message) {
    this.ctx.body = {
      code: 2000,
      message,
    };
  }

 
}

module.exports = BaseController;
