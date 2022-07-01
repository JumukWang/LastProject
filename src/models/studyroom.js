const mongoose = require("mongoose");

const { Schema } = mongoose;
const studySchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    content: {
        type: String,
    },
    date: {
        type: String,
    },
    tagId: {

    },
    roomId: {

    },
    word: {
        type: String,
    }
});




module.exports = mongoose.model("studyRoom", studySchema);
