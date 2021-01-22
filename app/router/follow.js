'use strict'

module.exports = (app) => {

  const { router,  controller, middleware } = app;
  const jwt = middleware.jwt(app);
  const { queryIdols, followUserId, cancelFollow, queryFans } = controller.follow;

  router.get('/api/queryFollows',jwt, queryIdols);
  router.post('/api/follow',jwt, followUserId);
  router.post('/api/cancelFollow',jwt, cancelFollow);
  router.get('/api/queryFans',jwt, queryFans);

}