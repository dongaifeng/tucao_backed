
'use strict';

module.exports = (options, app) => {
  return async function log(ctx, next) {
    console.log('请求：', ctx.request.method, ctx.request.url);
    await next();
  };
}
;
