'use strict';
const Service = require('egg').Service;

module.exports = class Follow extends Service {

  async query(_id, beFollowId) {
    const sql = `select * follows where user_id=${_id} and fans_id=${beFollowId}`;
    const result = await this.app.mysql.query(sql);
    return result;
  }

  async updateDelFlag(_id, beFollowId, flag) {
    const sql = `update follows set del_flag = ${flag} where user_id=${_id} and fans_id=${beFollowId}`;
    const res = await this.app.mysql.query(sql);
    return res;
  }

  async insert(_id, beFollowId) {
    const sql = `INSERT INTO follows(user_id, fans_id) VALUES(${beFollowId}, ${_id})`;

    const res = await app.mysql.query(sql);
    return res;
  }

  async queryByUserId(obj) {
    let where, colunm;
    if (obj.user_id) {
      where = `user_id = ${obj.user_id}`;
      colunm = `fans_id`;
    } else {
      where = `fans_id = ${obj.fans_id}`;
      colunm = `user_id`;
    }

    const sql = `SELECT
                u.user_id,
                u.introduce,
                u.avatar,
                u.user_name,
                f.del_flag 
              FROM users u
              left join follows f
              on u.user_id = f.user_id
              WHERE u.user_id IN (
                SELECT ${colunm} FROM follows
                WHERE ${where}
                AND del_flag = 0
              )`;
    const result = await this.app.mysql.query(sql);
    return result;
  }

};
