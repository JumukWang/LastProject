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
module.exports = { User };
