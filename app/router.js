'use strict';
module.exports = app => {
  const { router, controller } = app;
  console.log('---开始请求---->')

  require('./router/user')(app);
  require('./router/article')(app);
  require('./router/follow')(app);

  router.get('/', controller.home.index);

  router.get('/api/captcha', controller.utils.captcha);
  router.get('/api/sendcode', controller.utils.sendcode);
  router.post('/api/uploadFile', controller.utils.uploadFile_file);
  router.post('/api/uploadBuffer', controller.utils.uploadBuffer);

  // router.get('/test', controller.home.test);

  // router.post('/api/moodList', controller.mood.list);

  // router.post('/api/addMood', controller.mood.add);

  // router.post('/api/search', controller.mood.search);

  // router.post('/api/upload', controller.mood.upload);


};
