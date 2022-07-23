const config = require('../config');

const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect(config.MONGO_URL, { ignoreUndefined: true }).catch((err) => {
    console.error(err);
  });
};

// 여기에 스키마 함수 만들기

module.exports = connect;
