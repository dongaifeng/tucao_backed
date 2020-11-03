'use strict';
const Service = require('egg').Service;

module.exports = class extends Service {
  async getList(offset = 0, size = 10) {
    const result = await this.app.mysql.select('mood_list', {
      orders: [[ 'id', 'desc' ]],
      limit: size, // 返回的条数
      offset, // 从这个位置返回
    });
    console.log('-------------------------------------------result', result);
    return result;
  }

  async insert(table, data) {
    const result = await this.app.mysql.insert(table, data);
    if (result.affectedRows === 1) {
      return true;
    }
  }

  async search(name) {
    const list = await this.app.mysql.select('mood_list', {
      where: { name },
    });

    return list;
  }
}
;
