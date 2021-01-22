'use strict';
const Service = require('egg').Service;

module.exports = class Follow extends Service {

  async query(_id, beFollowId) {
    const sql = `select * follows where user_id=${beFollowId} and fans_id=${_id}`;
    const result = await this.app.mysql.query(sql);
    return result || [];
  }

  async updateDelFlag(_id, beFollowId, flag) {
    const sql = `update follows set del_flag = ${flag} where user_id=${beFollowId} and fans_id=${_id}`;
    const res = await this.app.mysql.query(sql);
    return res;
  }

  async insert(_id, beFollowId) {
    const sql = `INSERT INTO follows(user_id, fans_id) VALUES(${beFollowId}, ${_id})`;

    const res = await app.mysql.query(sql);
    return res;
  }

  async queryIdolByUserId(fans_id) {
  
    const sql = `SELECT f.user_id, f.del_flag, u.introduce, u.avatar, u.user_name 
                FROM follows f
                LEFT JOIN users u
                ON u.user_id = f.user_id
                WHERE f.fans_id = ${fans_id} AND f.del_flag = 0`;
    const result = await this.app.mysql.query(sql);
    return result;
  }

  async queryFansByUserId(user_id) {
  
    const sql = `SELECT f.fans_id as user_id, f.del_flag, u.introduce, u.avatar, u.user_name
              FROM follows f
              left join users u
              on u.user_id = f.fans_id
              WHERE f.user_id = ${user_id} and f.del_flag = 0`;
    const result = await this.app.mysql.query(sql);
    return result;
  }

};
