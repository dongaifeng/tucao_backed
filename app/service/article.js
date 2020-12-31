'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {

  async query({ page, size}) {
    const { app } = this;
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

    let res = await app.mysql.query(sql);

    if(res.length < 0 || !Array.isArray(res)) {
      return this.success([])
    }

    // 创建一个数组， 遍历list 每一项返回一个Promise，在peomise里面创建一个对象，查询star 并赋值给这个对象，返回这个对象，
    // 把这个Promise 放入 数组，等到数组中 所有的 resolve 就success
    const arr = [];
    res.forEach(ele => {
      arr.push(new Promise(async (resolve) => {
        const users = await app.mysql.query(`select user_id from collect where article_id=${ele.id}`) || [];
        const star = users.map(i => i.user_id)
        resolve({...ele, star}) 
      }))
    })

   const list = await Promise.all(arr);

    return list;

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
