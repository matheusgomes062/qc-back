const db = require('../models');
// const Auth = require('../auth')
const Client = db.client;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.findAll = (req, res) => {
  const { nome, size, page } = req.query;
  var condition = nome
    ? { nome: { $regex: new RegExp(nome), $options: 'i' } }
    : {};

  const { offset } = getPagination(page, size);

  Client.paginate(condition, { offset })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        clients: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving client.'
      });
    });
};

exports.create = (req, res) => {
  if (!req.body.nome && !req.body.email && !req.body.password) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  const exists = Client.findOne({ email: req.body.email });
  if (exists.email)
    return res.status(500).send({ message: 'Client already exists.' });

  const client = new Client({
    nome: req.body.nome,
    email: req.body.email,
    password: req.body.password
  });

  client
    .save(client)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Client.'
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Client.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: 'Not found Client with id ' + id });
      else res.send(data);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Error retrieving Client with id=' + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!'
    });
  }

  const id = req.params.id;

  Client.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Client with id=${id}. Maybe Client was not found!`
        });
      } else res.send({ message: 'Client was updated successfully.' });
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error updating Tutorial with id=' + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Client.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
        });
      } else {
        res.send({
          message: 'Client was deleted successfully!'
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Client with id=' + id
      });
    });
};

exports.deleteAll = (_, res) => {
  Client.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Client were deleted successfully!`
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all clients.'
      });
    });
};
