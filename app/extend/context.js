'use strict';
// 给ctx添加自定义方法 ctx.bar()
module.exports = {
  bar(param) {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
  },
  // 属性添加用get
  get name() {
    return 'aaa';
  },
};
