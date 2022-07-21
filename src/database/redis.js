// redis.js
const redis = require('redis');
const config = require('../config');

const redisClient = redis.createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  password: config.REDIS_PASSWORD,
  legacyMode: true,
});
const set = (key, value) => {
  redisClient.set(key, JSON.stringify(value));
};
const get = (req, res, next) => {
  let key = req.originalUrl;

  redisClient.get(key, (error, data) => {
    if (error) {
      res.status(400).send({
        result: false,
        msg: error.message,
      });
    }
    if (data !== null) {
      console.log('data from redis!');
      res.status(200).send({
        result: true,
        data: JSON.parse(data),
      });
    } else next();
  });
};

module.exports = { redisClient, set, get };
