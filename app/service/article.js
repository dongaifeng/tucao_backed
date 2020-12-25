'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {

  async query({ page, size}) {
    const sql = `select 
                  u.user_name as ownerName,
                  a.title,
                  id,
                  content,
                  likes,
                  u.avatar as avatar,
                  message,
                  star,
                  owner,
                  a.create_date as createdAt,
                  DATE_FORMAT(a.update_date,'%Y年%m月%d日%h:%i:%s') as updatedAt
                from articles as a
                left join users as u
                on a.owner = u.user_id
                limit ${(page - 1) * size}, ${size}`;


    let res = await this.app.mysql.query(sql);
    res.forEach(ele => {
      ele.star = ele.star && ele.star.split(',');
    });

    return res;

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
}
;
