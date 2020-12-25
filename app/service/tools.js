'use strict';

const Service = require('egg').Service;
const nodemailer = require('nodemailer');
const path = require('path');
const fse = require('fs-extra');

class Tools extends Service {

  async sendemail(info) {
    let options = this.config.qq;
    const myEmail = options.auth.user;
    const transporter = nodemailer.createTransport(options);

    try {
      const res = await transporter.sendMail({  
        from: myEmail, 
        cc: myEmail,
        ...info
       });
       
      return res.accepted[0];
    } catch (e) {
      console.log('err', e);
      return false
    }
  }


  async uploadFile_file(file, dir) {
    const uploaddir = this.config.uploaddir;
    // 存到public目录
    try {
      await fse.move(file.filepath, uploaddir + dir);
      return `/public/uploads/${dir}`;
      
    } catch (e) {
      console.log('err', e);
      return false;
    }

    
  }

}

module.exports = Tools;