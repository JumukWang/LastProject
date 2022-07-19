const { logger } = require('../config');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.logging = (req, res, next) => {
  var logStr = {};
  try {
    switch (req.method) {
      case 'GET':
        logStr.query = req.query;
        break;
      case 'POST':
        logStr.body = req.body;
        break;
      case 'DELETE':
        logStr.query = req.query;
        break;
    }

    logger.info(JSON.stringify(logStr));

    next();
  } catch (error) {
    logger.error(error);
    res.send({ result: false });
  }
};
