// redis.js
const redis = require('redis');
const config = require('../config');

const redisClient = redis.createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  password: config.REDIS_PASSWORD,
  legacyMode: true,
});

module.exports = redisClient;
