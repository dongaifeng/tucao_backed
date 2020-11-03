'use strict';
const Controller = require('egg').Controller;

module.exports = class extends Controller {
  // 查询
  async index() {
    console.log('get  查询');
    const ctx = this.ctx;
    const id = await ctx.service.detail.create();
    ctx.body = id;
    ctx.status = 201;
  }
  // 子路径查询
  async new() {
    console.log('get  查询');
    const ctx = this.ctx;
    const id = await ctx.service.detail.create();
    ctx.body = id;
    ctx.status = 201;
  }

  // 参数方式的查询
  async show() {
    console.log('get  查询' + this.ctx.params.id);
    const ctx = this.ctx;
    const id = await ctx.service.detail.create();
    ctx.body = id;
    ctx.status = 201;
  }
}
;
