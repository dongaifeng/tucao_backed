'use strict';
// const Controller = require('egg').Controller;
const Controller = require('../core/base_controller'); // 使用自定义controller


class User extends Controller {
  // this上有  ctx, app, service, config, logger
  async login() {
    const { ctx } = this;
    console.log('params', ctx.params.id);
    ctx.body = 'dddd';
  }

  async register() {
    const { ctx } = this;
    const { email, passwd, captcha, nickname } = ctx.request.body;

    // 验证参数
    try {
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数不对', -1, e.errors);
    }

    // 检查验证码
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {

      // 检查邮箱重复
      if (await this.checkEmail(email)) {
        this.error('邮箱重复');
      } else {
        // 存储用户信息   密码要加密
        const res = ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd + HashSalt),
        });

        if (res._id) { this.message('注册成功'); }
      }
    } else {
      this.error('验证码错误');
    }


    this.success({ name: nickname });
  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }

  async admin() {
    const { ctx } = this;
    console.log('query', ctx.query);
    ctx.body = ctx.query;
  }

  async form(ctx) {
    console.log('query', this.ctx.request.body);
    ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
  }

  async name(ctx) {
    const rule = {
      name: { type: 'number' },
    };
    console.log('query', this.ctx.request.body);
    ctx.validate(rule);
    ctx.body = ctx.request.body;
  }

  async bbb(ctx) {
    ctx.redirect('/');
  }

  async page() {
    // ctx.redirect('/');
    this.success('哈哈哈');
  }

  async upload(ctx) {
    await ctx.render('/file.tpl');
  }

  async file(ctx) {
    const file = ctx.request.files[0];
    const name = file.filename;
    ctx.body = {
      file,
      name,
    };
  }
  async abc(ctx) {
    const res = await ctx.curl('./home.js', { streaming: true });
    ctx.set(res.header);
    ctx.body = res.res;
  }
}

module.exports = User;
