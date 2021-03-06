'use strict'

const BaseController = require('../core/base_controller');
const await = require('await-stream-ready/lib/await');

class Follow extends BaseController {

  // 查询我关注了谁
  async queryIdols() {
    const { ctx, app } = this;
    const { email, _id } = ctx.state;

    const user = await ctx.service.follow.queryIdolByUserId(_id);

    if (!user) return this.error('查询不到关注者');
    this.success(user);
  }

  // 查询 粉丝
  async queryFans() {
    const { ctx, app } = this;
    const { email, _id } = ctx.state; 
    const user = await ctx.service.follow.queryFansByUserId( _id);

    if (!user) return this.error('查询不到粉丝');
    this.success(user);
  }

  // 关注
  async followUserId() {
    // 先查看 follows表用没有: fans_id是state._id, user_id是request.body.userId
    // 有 把 del_flag = 1
    // 没有 插入 并 del_flag = 0
    const { ctx, app } = this;
    const { beFollowId } = ctx.request.body;
    const { email, _id } = ctx.state;
    let res;
    const arr = await ctx.service.follow.query(_id, beFollowId);
    console.log('arr---->', arr)

    if(arr.length > 0) {
      res = await ctx.service.follow.updateDelFlag(_id, beFollowId, 0);
    } else {
      res = await ctx.service.follow.insert(_id, beFollowId);
    }

    if (res && res.affectedRows === 1) { 
      this.success({beFollowId}, '关注成功！') 
    };
  }

  // 取消关注 
  async cancelFollow() {
    const { ctx, app } = this;
    const { beFollowId } = ctx.request.body;
    const { email, _id } = ctx.state;

    const res = await ctx.service.follow.updateDelFlag(_id, beFollowId, 1);
    if (res.affectedRows === 1) { 
      this.success({beFollowId}, '取消关注成功！') 
    };
  }
}

module.exports = Follow