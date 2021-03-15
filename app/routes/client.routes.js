module.exports = (app) => {
  const clients = require('../domain/client/controllers/client.controller');
  const Auth = require('../domain/client/middleware/auth');

  var router = require('express').Router();

  router.post('/', Auth, clients.create);

  router.get('/', Auth, clients.findAll);

  router.get('/:id', Auth, clients.findOne);

  router.put('/:id', Auth, clients.update);

  router.delete('/:id', Auth, clients.delete);

  router.delete('/', Auth, clients.deleteAll);

  app.use('/api/client', Auth, router);
};
