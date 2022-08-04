const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const studySchema = new Schema({
  roomId: {
    type: Number,
    unique: true,
  },
  hostId: {
    type: Number,
    default: 0,
  },
  attendName: {
    type: Array,
    unique: true,
  },
  title: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  content: {
    type: String,
    require: true,
  },
  date: {
    type: Array,
    require: true,
  },
  word: {
    type: String,
  },
  groupNum: {
    type: Array,
  },
  likeUser: {
    type: Array,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  tagName: {
    type: Array,
    require: true,
  },
  imgUrl: {
    type: String,
  },
  lock: {
    type: Boolean,
    require: true,
  },
});

studySchema.plugin(AutoIncrement, { inc_field: 'roomId' });
const Room = mongoose.model('Room', studySchema);

module.exports = {
  Room,
};
