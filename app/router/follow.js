'use strict'

module.exports = (app) => {

  const { router,  controller, middleware } = app;
  const jwt = middleware.jwt(app);
  const { queryByUserId } = controller.follow;

  router.get('/api/queryFollows',jwt, queryByUserId);

}