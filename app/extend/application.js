'use strict';

// 与 Koa Application 的 prototype 对象进行合并
module.exports = {
  foo(params) {
    console.log(`${params} 这是我application里的方法`); // app.foo()  可以这样使用
  },
}
;
