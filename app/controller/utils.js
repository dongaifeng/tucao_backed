'use strict';

const BaseController = require('../core/base_controller');
const svgCaptcha = require('svg-captcha');
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const fse = require('fs-extra');

class UtilController extends BaseController {
  // 生成验证码图片
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      noise: 3,
      color: true,
    });

    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    console.log('生成验证码', captcha.text);
    this.ctx.body = captcha.data;
  }


  // 向用户邮箱发送验证码
  async sendcode() {
    const { ctx } = this;
    const email = ctx.query.email;

    // 生成随机数 保存到session里
    const code = Math.random().toString().slice(2, 6);
    ctx.session.emailCode = code;
    const html = '<h1 style="text-algin:center;">欢迎你加入吐槽吧</h1><img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605266685002&di=702f2757514be14d3df58bde31c855dd&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fimages%2F20170820%2F85f4cc5539fe4a738dc5298c49cb5c56.jpeg" /><div>验证码：' + code + '</div>'

    const obj = {
      to: email,
      subject: '来自 www.tocao.com 的验证码',
      text: '',  // text 和 html 只能使用一个
      html: html,
    };

    const hasSend = await this.service.tools.sendemail(obj);
    console.log('邮箱验证码', code, hasSend);

    if (hasSend) {
      this.msg('验证码已发送到：' + hasSend);
    } else {
      this.error('发送失败');
    }
  }

  async uploadBuffer() {
    const { ctx } = this;
    const form = ctx.req.readableBuffer.head.data;
    
    console.log('的arrayBuff', form);

    const buffer = Buffer.from(form);

    console.log('转成buffer', buffer);

    const target = path.join(`app/public/uploads/buf.png`);
    fs.writeFileSync(target, form);

    this.success({
      buffer,
      form
    })


  }

  // file 方式 上传
  async uploadFile_file() {
    const { ctx } = this;

    // 拿到这个文件
    const file = ctx.request.files[0];
    const { filename, hashname } = ctx.request.body;
    console.log('file---------------------->', file);
    console.log('ctx.request---------------------->', ctx.request.body);

    // 存到public目录
    await fse.move(file.filepath, 'app/public/uploads/' + hashname + '_' + filename);


    this.success({
      url: `/public/${hashname + filename}`,
    })
  
  }

  // 文件流 方式上传, 需要去配置文件 修改  mode: 'stream'
  async uploadFile_stream(ctx) {
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

     this.success({
      name,
      src: `/public/uploads/${name}`,
    })
    
  }
}
module.exports = UtilController;