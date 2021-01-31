'use strict';

module.exports = app => {
  const { router, controller, middleware } = app;
  const jwt = middleware.jwt(app);

  router.post('/api/article/collect', jwt, controller.article.collect); // 收藏 文章
  router.get('/api/article/queryCollect', jwt, controller.article.queryCollect); // 查询收藏 文章
  router.get('/api/article/follow', jwt, controller.article.queryFollowArticles); // 查询关注着们的 文章
  router.post('/api/article/like', controller.article.like); // 点赞 文章
  router.post('/api/article/createComment', controller.article.createComment); // 评论
  router.post('/api/article/queryComment', controller.article.queryComment); // 
  router.resources('article', '/api/article', controller.article); // CRUD写法 controcontaller指定对应方法 对应update， create

};
