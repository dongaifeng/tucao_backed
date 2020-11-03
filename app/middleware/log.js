
'use strict';

module.exports = (options, app) => {
  return async function log(ctx, next) {
    console.log('使用中间件');
    await next();
  };
}
;
