'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const title = '我是首页'; // 向模板传入数据
    await this.ctx.render('index', {
      title,
    });
  }

  async test() {

    this.ctx.body = '测试成功';
  }

}

module.exports = HomeController;
