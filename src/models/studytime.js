const mongoose = require('mongoose');

const { Schema } = mongoose;
const studyTimeSchema = new Schema({
  studytime: {
    type: String,
  },
  timeId: {
    type: Number,
    default: 0,
  },
  userId: {
    type: Number,
    unique: true,
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
});

module.exports = mongoose.model('studyTime', studyTimeSchema);
