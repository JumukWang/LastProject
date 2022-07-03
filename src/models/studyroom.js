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
        type: Number,
    },
    roomId: {
        type: Number,
        unique: true,
    },
    word: {
        type: String,
    }
});

studySchema.plugin(AutoIncrement, { start_seq: 1, inc_field: "roomId" })
module.exports = mongoose.model("studyRoom", studySchema);
