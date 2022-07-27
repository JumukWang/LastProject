const mongoose = require('mongoose');

const { Schema } = mongoose;
const studyTimeSchema = new Schema(
  {
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
      default: 0,
    },
    todaysum: {
      type: String,
      default: 0,
    },
    todaysum_h: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
studyTimeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const Studytime = mongoose.model('Studytime', studyTimeSchema);

module.exports = { Studytime };
