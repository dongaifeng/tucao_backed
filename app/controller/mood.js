'use strict';
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const Controller = require('egg').Controller;
// const Controller = require('../core/base_controller'); // 使用自定义controller


class Mood extends Controller {
  async list(ctx) {
    const { page, size } = ctx.request.body;
    const offset = (page - 1) * size;
    const list = await ctx.service.mood.getList(offset, size);

    ctx.body = {
      code: 200,
      state: 'success',
      data: list,
    };
    ctx.status = 200;
  }

  async add(ctx) {
    const row = ctx.request.body;
    const result = await ctx.service.mood.insert('mood_list', row);
    if (result) {
      ctx.body = {
        code: 200,
        state: 'success',
        data: {},
      };
    }
  }

  async search(ctx) {
    const { name } = ctx.request.body;
    const list = await ctx.service.mood.search(name);
    ctx.body = {
      code: 200,
      state: 'success',
      data: list,
    };
  }

  async upload(ctx) {


    // // file 方式 上传
    // const file = ctx.request.files[0];
    // const name = 'avatar_' + path.basename(file.filename);
    // let result;
    // try {
    //   // 处理文件
    //   result = fs.writeFileSync(path.join(`app/public/uploads/${name}`), file);
    // } catch (err) {
    //   // 需要删除临时文件
    //   await fs.unlink(file.filepath);
    //   throw err;
    // }


    // 获取文件流
    const stream = await ctx.getFileStream();
    // 生成文件名
    const name = 'avatar_' + Date.parse(new Date()) + path.basename(stream.filename);
    console.log('----name----->', name);

    // 要写入的文件：路径+文件名
    const target = path.join(`app/public/uploads/${name}`);
    // 创建一个写入流
    const writeStream = fs.createWriteStream(target);

    // 文件处理
    let result;
    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }

    ctx.body = {
      code: 200,
      state: 'success',
      data: {
        name,
        src: `/public/uploads/${name}`,
      },
    };
  }


}

module.exports = Mood;
