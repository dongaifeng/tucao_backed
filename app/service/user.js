'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {

  async getuserById(_id) {
    const sql = `select 
                  user_id,
                  user_name as name,
                  avatar,
                  email,
                  phone,
                  address,
                  country,
                  introduce,
                  tags
                from users 
                where user_id = '${_id}'`;


    let res = await this.app.mysql.query(sql);
    return res[0];

  }

  async create(page = '3') {
    const sql = 'select * from admin';
    try {
      const res = await this.app.mysql.query(sql, page);
    } catch (error) {
      throw new Error('response status is not 200'); // 错误信息 会被统一处理
      return {}
    }

    return res;
  }
};
