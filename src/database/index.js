const config = require('../config');

const mongoose = require('mongoose');

const connect = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_URL}/?retryWrites=true&w=majority`,
      {
        ignoreUndefined: true,
      },
    )
    .catch((err) => {
      console.error(err);
    });
};

// 여기에 스키마 함수 만들기

module.exports = connect;
