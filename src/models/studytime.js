const mongoose = require('mongoose');

const { Schema } = mongoose;
const studyTimeSchema = new Schema({
  studytime: {
    type: String,
  },
  email: {
    type: String,
  },
  startTime: {
    type: String,
  },
  outTime: {
    type: String,
  },
  day: {
    type: Number,
  },
  inTimestamp: {
    type: Number,
  },
  outTimestamp: {
    type: Number,
  },
  timedif: {
    type: Number,
  },
  weeksum: {
    type: String,
  },
  todaysum: {
    type: String,
  }
});

const Studytime = mongoose.model('Studytime', studyTimeSchema);
module.exports = { Studytime };
