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
    default: [1],
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

async function mainRoomList(perPage, page) {
  return Room.find({})
    .sort({ createAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage);
}

async function allRoomList(roomId) {
  return Room.find({ roomId });
}

async function roomNumber(roomId) {
  return Room.findOne({ roomId });
}

async function roomLikeUserUpdate(roomId, userId) {
  return Room.updateOne({ roomId }), { $push: { likeUser: userId } };
}

async function roomTagName(tagName, perPage, page) {
  return Room.find({ tagName })
    .sord({ createAt: -1 })
    .skip(perPage * (page - 1))
    .limit(perPage);
}
async function roomTagLength(tagName) {
  return Room.find({ tagName });
}

module.exports = { Room, allRoomList, roomNumber, roomLikeUserUpdate, roomTagName, roomTagLength, mainRoomList };
