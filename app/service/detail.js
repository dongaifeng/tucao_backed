'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {
  async create(page = '3') {
    const sql = 'select * from jobs';
    const res = await this.app.mysql.query(sql, page);

    return res;
  }
}
;
