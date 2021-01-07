'use strict'

module.exports = (app) => {

  const { router,  controller, middleware } = app;
  const jwt = middleware.jwt(app);
  const { queryByUserId, followUserId } = controller.follow;

  router.get('/api/queryFollows',jwt, queryByUserId);
  router.post('/api/follow',jwt, followUserId);

}