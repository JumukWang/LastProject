require("dotenv").config();

const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect(process.env.MONGO_URL, { ignoreUndefined: true }).catch((err) => {
        console.error(err);
    });
};

// 여기에 스키마 함수 만들기


module.exports = connect;