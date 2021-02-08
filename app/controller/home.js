'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

//   框架在 Context 上提供了 3 个接口，返回值均为 Promise:
// render(name, locals) 渲染模板文件, 并赋值给 ctx.body
// renderView(name, locals) 渲染模板文件, 仅返回不赋值
// renderString(tpl, locals) 渲染模板字符串, 仅返回不赋值

  async index() {
    const title = '我是首页'; // 向模板传入数据
    await this.ctx.render('index.html', {
      title,
    });
  }

  async create() {
    this.success([])
  }


}

module.exports = HomeController;
