const mongoose = require('mongoose');

const { Schema } = mongoose;
const daySchema = new Schema({
  userId: {
    type: Number,
  },
  day0: {
    type: Array,
    default: 0,
  },
  day1: {
    type: Array,
    default:0,
  },
  day2: {
    type: Array,
    default:0,
  },
  day3: {
    type: Array,
    default:0,
  },
  day4: {
    type: Array,
    default:0,
  },
  day5: {
    type: Array,
    default:0,
  },
  day6: {
    type: Array,
    default:0,
  },
});

const Day = mongoose.model('Day', daySchema);
module.exports = { Day };
