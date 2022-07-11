const mongoose = require('mongoose');

const { Schema } = mongoose;
const todoSchema = new Schema({});

module.exports = mongoose.model('todo', todoSchema);
