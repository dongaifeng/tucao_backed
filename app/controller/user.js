'use strict';

const BaseController = require('../core/base_controller'); // 使用自定义controller
const md5 = require('md5');
const jwt = require('jsonwebtoken');

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
    const sql = `select * from users where email = '${email}' and password = '${md5(password + HashSalt)}'`;
    const res = await app.mysql.query(sql);
    const user = res[0]

    if (!user) return this.error('用户不存在');
    // 把用户信息 加密成token 返回
    const token = jwt.sign({ _id: user.user_id, email, username: user.user_name }, app.config.jwt.secret, { expiresIn: app.config.jwt.expiresIn });
    this.success({ token, username: user.user_name, email });
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

  async getuserinfo() {
    const { ctx, app } = this;
    // const { password, email } = ctx.request.body;
    
    // console.log('query------>',  ctx.state);

    const {email, _id} = ctx.state;

    const sql = `select 
                  user_id,
                  user_name as name,
                  avatar,
                  email,
                  phone,
                  address,
                  country,
                  province,
                  city,
                  introduce,
                  tags
                from users 
                where email = '${email}' and user_id = '${_id}'`;
    const user = await app.mysql.query(sql);

    // console.log('user------>',user);


    if (!user) return this.error('用户不存在');
   
    this.success(user[0]);
  }

  async postuserinfo() {
    const { ctx, app } = this;
    const { userId, currentUserId } = ctx.request.body;

    const sql = `select 
                  user_id,
                  user_name as name,
                  avatar,
                  email,
                  phone,
                  address,
                  country,
                  province,
                  city,
                  introduce,
                  fans_count as fansCount,
                  follow_count as followCount,
                  article_count as articleCount,
                  tags
                from v_users 
                where user_id = ?`;
    let [user] = await app.mysql.query(sql, [userId]);
    let followStatus = false;
    if (currentUserId) {
      const arr = await ctx.service.follow.query(userId, currentUserId);
      console.log('arr---->', arr)
      if (arr.length > 0) {
        followStatus = true
      }
    }

    console.log('user------>',user);


    if (!user) return this.error('用户不存在');
   
    this.success({...user, followStatus});
  }

  async modifyuserinfo() {
    const { ctx, app } = this;
    const { city, introduce, name, phone, province, tags, country } = ctx.request.body;
    const {email, _id} = ctx.state;

    const sql = `update users
                set
                city='${city}',
                country='${country}',
                introduce='${introduce}',
                user_name='${name}',
                phone='${phone}',
                province='${province}',
                tags='${tags}',
                update_date=NOW()
                where email = '${email}' and user_id = '${_id}'`;
    const res = await app.mysql.query(sql);
    console.log(res, '<<<<>><>>')
    if (res.affectedRows === 1) {
      return this.success({name, email});
    }
    return this.error('修改用户信息失败');
  }

  async updateAvatar() {
    const { ctx, app } = this;
    const {email, _id} = ctx.state;
    const file = ctx.request.files[0];
    const { filename, hashname } = ctx.request.body;
    const dir = '/avatars/' + hashname + '_' + filename;
    const filePath = await this.service.tools.uploadFile_file(file, dir);
    if (filePath) {
      const sql = `update users
                set
                avatar='${filePath}',
                update_date=NOW()
                where email = '${email}' and user_id = '${_id}'`;
      const res = await app.mysql.query(sql);
      if (res.affectedRows === 1) {
        return this.success({email, filePath});
      }
    }
    
    return this.error('修改头像失败');
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
