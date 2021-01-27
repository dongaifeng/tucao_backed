'use strict';

module.exports = app => {
  const { router,  controller, middleware } = app;
  const jwt = middleware.jwt(app); // jwt中间件
  const { login, logout, getuserinfo, postuserinfo, modifyuserinfo, captcha, register, updateAvatar, addTags } = controller.user;
  router.post('/api/login', login);
  router.get('/api/logout', logout);
  router.get('/api/getUser', jwt, getuserinfo);
  router.post('/api/getUser', postuserinfo);
  router.post('/api/updateUser', jwt, modifyuserinfo);
  router.post('/api/updateAvatar', jwt, updateAvatar);
  router.post('/api/register', register);
  router.post('/api/addTags', addTags);
};
