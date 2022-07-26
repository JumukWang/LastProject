const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    userId: { type: Number, unique: true, default: 0 },
    email: { type: String, unique: true },
    nickname: { type: String, unique: true },
    password: { type: String },
    profile_url: { type: String },
    snsId: {
      type: String,
      require: true,
      unique: true,
    },
    provider: {
      type: String,
      require: true,
    },
    hostRoom: {
      type: Array,
    },
    attendRoom: {
      type: Array,
    },
    userLike: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const User = mongoose.model('User', userSchema);

async function findByUser(email) {
  return await User.findOne({ email });
}

async function nicknameCheck(nickname) {
  return await User.findOne({ nickname });
}

async function userMypage(userId) {
  return await User.findOne({ userId: Number(userId) });
}

async function userInfoUpdate(userId, nickname, hashPassword, passwordCheck, imgUrl) {
  await await User.updateOne({ userId }, { $set: { nickname, password: hashPassword, passwordCheck, imgUrl } });
}

async function userFind() {
  return await User.find({}, { userId: 1, nickname: 1, email: 1 });
}

async function userRoomLikeUpdate(nickname, roomInfo) {
  return await User.updateOne({ nickname }, { $push: { userLike: roomInfo } });
}

async function userRoomDisLikeUpdate(nickname, roomInfo) {
  return await User.updateOne({ nickname }, { $pull: { userLike: roomInfo } });
}
module.exports = {
  User,
  findByUser,
  nicknameCheck,
  userMypage,
  userInfoUpdate,
  userFind,
  userRoomLikeUpdate,
  userRoomDisLikeUpdate,
};
