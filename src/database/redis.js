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
const get = (res, req, next) => {
  let key = req.originalUrl;

  redisClient.get(key, (error, data) => {
    try {
      if (data !== null) {
        console.log('data from redis!');
        return JSON.parse(data);
      } else next();
    } catch {
      console.log(error);
    }
  });
};

module.exports = { redisClient, set, get };
