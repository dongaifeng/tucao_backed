'use strict';
module.exports = app => {
  app.router.get('/page', app.controller.user.page);
};
