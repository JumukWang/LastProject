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
    // snsId: {
    //   type: String,
    //   require: true,
    //   unique: true,
    // },
    provider: {
      type: String,
      require: true,
    },
    profileImg: {
      type: String,
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
    day : [{type: mongoose.Schema.Types.ObjectId, ref: "Day"}] ,
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
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const User = mongoose.model('User', userSchema);
module.exports = { User };
