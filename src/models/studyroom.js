const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose)

const { Schema } = mongoose;
const studySchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    password: {
        type: Number,
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
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

studySchema.plugin(AutoIncrement, { start_seq: 1, inc_field: "roomId" })
const studyroom = mongoose.model("studyroom", studySchema)
module.exports = studyroom;
