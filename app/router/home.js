'use strict';

module.exports = app => {
  const { router, controcontaller } = app;

  router.resources('posts', '/api/posts', controller.posts); // CRUD写法 controcontaller指定对应方法 对应update， create
};
