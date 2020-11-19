'use strict';

const BaseController = require('../core/base_controller'); // 使用自定义controller
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const await = require('await-stream-ready/lib/await');

const HashSalt = 'dfkjhgsldkujr';
const createRule = {
  email: { type: 'email' },
  password: { type: 'string' },
  svgCode: { type: 'string' },
  username: { type: 'string' },
  emailCode: { type: 'string' },
};

class User extends BaseController {
  // this上有  ctx, app, service, config, logger
  
  async login() {
    const { ctx, app } = this;
    const { password, email } = ctx.request.body;
  
    // 从数据库 读取用户
    // const user = await ctx.model.User.findOne({ email, password: md5(password + HashSalt) });
    const sql = `select * from users where users.email = ${email} and password = ${md5(password + HashSalt)}`;
    const user = app.mysql.query(sql);
    if (!user) return this.error('用户不存在');
    
    // 把用户信息 加密成token 返回
    const token = jwt.sign({ _id: user._id, email, username: user.username }, app.config.jwt.secret, { expiresIn: '1h' });
    this.success({ token, username: user.username, email });
  }

  async register() {
    const { ctx, app } = this;
    const { email, password, emailCode, username, svgCode } = ctx.request.body;

    console.log('----------->', ctx.request.body, ctx.session)

    // 验证参数类型
    try {
      ctx.validate(createRule);
    } catch (e) {
      return this.error('输入内容有误，请检查', -1, e.errors);
    }



    if (emailCode !== ctx.session.emailCode) {
      return this.error('邮箱验证码错误，请查看邮箱');
    }

    // 检查图片验证码
    if (svgCode.toUpperCase() === ctx.session.captcha.toUpperCase()) {

      // 检查邮箱重复
      if (await this.checkEmail(email)) {
        return this.error('此邮箱已经注册过了');
      } else {
        // 存储用户信息,密码要加密
        // const res = ctx.model.User.create({ email,  username, password: md5(password + HashSalt) });
        const _psd = md5(password + HashSalt)
        const sql = `insert into users
                    set 
                    user_name='${username}',
                    avatar=null,
                    email='${email}',
                    password='${_psd}',
                    update_date=NOW(),
                    create_date=NoW();`
       
        const res = await app.mysql.query(sql);
        console.log(res, '<-------')
        if (res.affectedRows === 1) { this.success({ name: username, status: 'ok' }) }
      }
    } else {
      this.error('验证码错误，情输入图片中的字母');
    }
  }

  async checkEmail(email) {
    // const user = await this.ctx.model.User.findOne({ email });

    const sql = `select * from users where email = '${email}'`;
    const user = await this.app.mysql.query(sql);
    
    return user.length > 0;
  }

  async captcha(ctx) {
    console.log('query', this.ctx.request.body);
    ctx.body = `body: ${JSON.stringify(ctx.request.body)}`;
  }

  async getuserinfo(ctx) {
    const rule = {
      name: { type: 'number' },
    };
    console.log('query', this.ctx.request.body);
    ctx.validate(rule);
    ctx.body = ctx.request.body;
  }

  async logout(ctx) {
    // ctx.redirect('/');
    const res = await this.service.detail.create(1);
    this.success(res)
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
