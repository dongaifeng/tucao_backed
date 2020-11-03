'use strict';

module.exports = app => {
  const { router,  controller } = app;
  const { login, logout, getuserinfo, captcha, register } = controller;
  router.get('/api/login', login);
  router.get('/api/logout', logout);
  router.get('/api/register', register);
};
