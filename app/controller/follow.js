'use strict'

const BaseController = require('../core/base_controller');
const await = require('await-stream-ready/lib/await');

class Follow extends BaseController {

  async queryByUserId() {
    const { ctx, app } = this;
    const { email, _id } = ctx.state;

    const sql = `SELECT * FROM users
                  WHERE user_id IN (
                    SELECT follow_id FROM follows
                    WHERE user_id = ${_id}
                  )`;
    const user = await app.mysql.query(sql);

    if (!user) return this.error('查询不到关注者');
    this.success(user);
  }

  async followUserId() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;

    const sql = ``;
    const res = await app.mysql.query(sql);

    this.success({ res })
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