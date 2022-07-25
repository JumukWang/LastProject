const mongoose = require('mongoose');

const { Schema } = mongoose;
const daySchema = new Schema({
  userId: {
    type: Number,
  },
  // day : {
  //   type: mongoose.Schema.Types.ObjectId, ref: "User"
  // },
  day0: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day1: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day2: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day3: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day4: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day5: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
  day6: {
    type: Array,
    default:0,
    createdAt: 1,
    expireAfterSeconds: 60,
  },
});

const Day = mongoose.model('Day', daySchema);
module.exports = { Day };
