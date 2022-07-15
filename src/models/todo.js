const mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose)

const { Schema } = mongoose;
const todoSchema = new Schema({
    roomId: { type: Number, unique: true },
    todoId: { type: Number, unique: true },
    text: { type: String, required: true },
    date: { type: String }
},
{
    timestamps: true
});

todoSchema.plugin(autoIncrement, { start_seq: 1, inc_field: "todoId" })
const studyroom = mongoose.model("todo", todoSchema)
module.exports = studyroom;
