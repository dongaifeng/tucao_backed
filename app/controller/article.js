'use strict';

const BaseController = require('../core/base_controller');

class ArticleController extends BaseController {

  async index() {
    const {ctx, app} = this;
    const { page, size} = ctx.query;
    const res = await ctx.service.article.query({ page, size});
    console.log('res---index-->', res)
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
    const {ctx, app} = this;
    const { id } = ctx.params;

    const { page = 1, size = 100} = ctx.query;
    const res = await ctx.service.article.query({ page, size, where: `where owner=${id}`});
    console.log('res---index-->', res)
    this.success(res)
  }

  // async new () {
  //   this.success([])
  // }

  // async update() {
  //   this.success([])
  // }

  async queryCollect() {

    const {ctx, app} = this;
    const {email, _id} = ctx.state;
    const sql = `
                SELECT a.id, a.title, a.content, a.owner, a.user_name, DATE_FORMAT(c.create_date,'%Y年%m月%d日%h:%i:%s') as create_date FROM (
                  SELECT articles.*, u.user_name from articles 
                  RIGHT JOIN users u 
                  ON articles.owner = u.user_id
                ) AS a 
                RIGHT JOIN collect c
                ON a.id = c.article_id 
                WHERE c.user_id = ${_id} `;
    
    // 使用 mysql.escape 方法。防止sql注入，并且 调用了  存储过程。
    const res = await app.mysql.query(`CALL p_query_collect(?)`, [_id]);
    console.log('000000', res)
    this.success(res[0]);
  }

  async collect() {
    // 收藏文章
    // 检查是否已收藏 查询 user_id and article_id 对应的一条数据
    // 查到 就是取消收藏
    // 查不到 就是收藏
    // 1 将 user_id article_id 插入到 collect表
    // 查询 新的列表 返回到前台
    const {ctx, app} = this;
    const { id } = ctx.request.body;
    const {email, _id} = ctx.state;

    const res = await app.mysql.query(`select * from collect where user_id=${_id} and article_id=${id}`);

    console.log(res, '<----');
    if(res.length > 0) {

      const sql = `delete from collect where user_id=${_id} and article_id=${id}`;
      const res = await app.mysql.query(sql);
      if (res.affectedRows > 0) { this.success({ status: 'ok' }, '取消收藏成功！') };  

    } else {
      const sql = `INSERT INTO collect (user_id, article_id, create_date, update_date)
            VALUES (${_id}, ${id}, NOW(), NOW())`;
      const res = await app.mysql.query(sql);
      if (res.affectedRows === 1) { this.success({ status: 'ok' }, '收藏成功！') };
     
    }
  }

  async like() {
    const {ctx, app} = this;
    const { id } = ctx.request.body;
    const article = await app.mysql.query(`select likes from articles where id = ${id}`);
    const num = article[0].likes + 1;
    console.log(article, '<-----')
    const sql = `update articles set likes=${num} where id=${id}`;
    const res = await app.mysql.query(sql);
    if (res.affectedRows === 1) { this.success({ status: 'ok' }, '点赞成功！') };
  }

  async queryComment() {
    const {ctx} = this;
    const { articleId } = ctx.request.body;
    const res = await ctx.service.article.queryComment(articleId);
    
    console.log(res, '<-----')
    this.success(res);
  }

  async createComment() {
    const { ctx, app } = this;
    const { comment, articleId, userId = null } = ctx.request.body;

    const sql = `INSERT INTO comments(article_id, body, owner) VALUES(${articleId}, '${comment}', ${userId})`;
    const res = await app.mysql.query(sql);

    if (res.affectedRows === 1) { 
      const arr = await ctx.service.article.queryComment(articleId);
      this.success(arr, '评论成功！') 
    };
  }


}

module.exports = ArticleController;
