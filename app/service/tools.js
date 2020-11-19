'use strict';

const Service = require('egg').Service;
const fse = require('fs-extra');
const path = require('path');
const nodemailer = require('nodemailer');

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

}

module.exports = Tools;