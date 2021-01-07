'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {
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

};
