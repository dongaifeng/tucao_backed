
'use strict';
const { Controller } = require('egg');

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      code: 2000,
      message: 'hahah',
      data,
    };
  }
}

module.exports = BaseController;
