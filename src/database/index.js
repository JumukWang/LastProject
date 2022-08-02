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

module.exports = connect;
