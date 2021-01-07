'use strict'

const BaseController = require('../core/base_controller');
const await = require('await-stream-ready/lib/await');

class Follow extends BaseController {

  async queryByUserId() {
    const { ctx, app } = this;
    const { email, _id } = ctx.state;

    const sql = `SELECT * FROM users
                  WHERE user_id IN (
                    SELECT fans_id FROM follows
                    WHERE user_id = ${_id}
                  )`;
    const user = await app.mysql.query(sql);

    if (!user) return this.error('查询不到关注者');
    this.success(user);
  }

  async followUserId() {
    const { ctx, app } = this;
    const { beFollowId } = ctx.request.body;
    const { email, _id } = ctx.state;

    const sql = `INSERT INTO follows
                (user_id, fans_id)
                VALUES(${beFollowId}, ${_id})`;

    const res = await app.mysql.query(sql);

    if (res.affectedRows === 1) { 
      this.success({beFollowId}, '关注成功！') 
    };
  }

  async cancelFollow() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;

    const sql = ``;
    const res = await ctx.mysql.query(sql);
    this.success({ res });
  }
}

module.exports = Follow