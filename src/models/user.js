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

async function newUser(user) {
  return new User(user).save().then((data) => data.id);
}

async function findByUser(email) {
  return User.findOne({ email });
}

async function nicknameCheck(nickname) {
  return User.findOne({ nickname });
}

async function userRoomLike(userId, roomId) {
  return User.updateOne({ userId }, { $push: { userLike: roomId } });
}

async function userMypage(userId) {
  return User.findOne({ userId: Number(userId) });
}

async function userInfoUpdate(userId, nickname, hashPassword, passwordCheck, imgUrl) {
  return User.updateOne({ userId }, { $set: { nickname, password: hashPassword, passwordCheck, imgUrl } });
}

async function userFind() {
  return User.find({}, { userId: 1, nickname: 1, email: 1 });
}

module.exports = {
  User,
  newUser,
  findByUser,
  userRoomLike,
  nicknameCheck,
  userMypage,
  userInfoUpdate,
  userFind,
};
