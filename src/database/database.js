require("dotenv").config();

const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect(process.env.MONGO_URL, { ignoreUndefined: true }).catch((err) => {
        console.error(err);
    });
};


module.exports = connect;