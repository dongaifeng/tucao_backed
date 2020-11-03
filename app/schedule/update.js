'use strict';
const Subscription = require('egg').Subscription;

class Update extends Subscription {

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '5445544s', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log('定时任务');
  }
}

module.exports = Update;

// module.exports = {
//   schedule: {
//     interval: '1m', // 1 分钟间隔
//     type: 'all', // 指定所有的 worker 都需要执行
//   },
//   async task(ctx) {
//     console.log('另一种写法');
//   },
// };

