'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.resources('article', '/api/article', controller.article); // CRUD写法 controcontaller指定对应方法 对应update， create
};
