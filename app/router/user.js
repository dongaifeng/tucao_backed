'use strict';

module.exports = app => {
  const { router,  controller } = app;
  const { login, logout, getuserinfo, captcha, register } = controller.user;
  router.get('/api/login', login);
  router.get('/api/logout', logout);
  router.post('/api/register', register);
};
