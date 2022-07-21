const logger = require('../config/winston');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.logging = (req, res, next) => {
  let logStr = {};

  try {
    logStr.url = req.url;

    logStr.method = req.method;
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
    logger.error();
    res.send({ result: false });
  }
};
