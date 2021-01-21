'use strict'

const BaseController = require('../core/base_controller');
const await = require('await-stream-ready/lib/await');

class Follow extends BaseController {

  async queryFollows() {
    const { ctx, app } = this;
    const { email, _id } = ctx.state;
    console.log('0000000000000000000000000000')

    const user = await ctx.service.follow.queryByUserId({user_id: _id});

    if (!user) return this.error('查询不到关注者');
    this.success(user);
  }

  async queryFans() {
    console.log('0000000000000000000000000000')
    const { ctx, app } = this;
    const { email, _id } = ctx.state; 
    const user = await ctx.service.follow.queryByUserId({fans_id: _id});

    if (!user) return this.error('查询不到粉丝');
    this.success(user);
  }

  async followUserId() {
    // 先查看 follows表用没有 这条数据
    // 有 把 del_flag = 1
    // 没有 插入 并 del_flag = 0
    const { ctx, app } = this;
    const { beFollowId } = ctx.request.body;
    const { email, _id } = ctx.state;
    let res;
    const arr = await ctx.service.follow.query(_id, beFollowId);

    if(arr.length > 0) {
      res = await ctx.service.follow.updateDelFlag(_id, beFollowId, 0);
    } else {
      res = await ctx.service.follow.insert(_id, beFollowId);
    }

    if (res && res.affectedRows === 1) { 
      this.success({beFollowId}, '关注成功！') 
    };
  }

  async cancelFollow() {
    const { ctx, app } = this;
    const { beFollowId } = ctx.request.body;
    const { email, _id } = ctx.state;

    const res = await ctx.service.follow.updateDelFlag(_id, beFollowId, 1);;
    if (res.affectedRows === 1) { 
      this.success({beFollowId}, '取消关注成功！') 
    };
  }
}

module.exports = Follow