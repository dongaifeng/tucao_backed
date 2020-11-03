'use strict';
module.exports = app => {
  const { router, controller } = app;

  require('./router/user')(app);
  require('./router/home')(app);

  router.get('/', controller.home.index);

  router.get('/test', controller.home.test);

  router.post('/api/moodList', controller.mood.list);

  router.post('/api/addMood', controller.mood.add);

  router.post('/api/search', controller.mood.search);

  router.post('/api/upload', controller.mood.upload);


};
