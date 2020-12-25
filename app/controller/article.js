'use strict';

const BaseController = require('../core/base_controller');
const await = require('await-stream-ready/lib/await');

class ArticleController extends BaseController {

  async index() {
    const {ctx, app} = this;

    const { page, size} = ctx.query;

    console.log('get请求------》', page, size);

    const res = await ctx.service.article.query({ page, size});

    this.success(res)
  }

  // 对应post 提交数据
  async create() {
    const {ctx, app} = this;
    const { user_id, content } = ctx.request.body;
    const { name, avatar } = await ctx.service.user.getuserById(user_id);
    // console.log('post请求------》', ctx.request.body)
    const sql = `INSERT INTO articles (title, id, content, likes, avatar, message, star, owner, create_date, update_date)
                VALUES ('${name}', null, '${content}', null, '${avatar}', '', null, ${user_id}, NOW(), NOW())`;
    const res = await app.mysql.query(sql);
    if (res.affectedRows === 1) { this.success({ status: 'ok' }) }
  }

  async show() {
    this.success([])
  }

  async new () {
    this.success([])
  }

  async update() {
    this.success([])
  }


}

module.exports = ArticleController;
