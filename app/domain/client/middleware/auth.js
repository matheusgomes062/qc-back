const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth');
const { promisify } = require('util');

require('dotenv/config');

const Auth = async (req, res, next) => {
  const authHeader = req.header.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    req.email = decoded.email;

    return next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = () => {
  Auth;
};
