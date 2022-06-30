const mongoose = require("mongoose")
const autoIncrement = require("mongoose-auto-increment")
autoIncrement.initialize(mongoose.connection)

const { Schema } = mongoose
const UserSchema = new Schema(
  {
    userId: { type: Number, unique: true, default: 0 },
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    password: { type: String, requried: true },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
)

UserSchema.plugin(autoIncrement.plugin, {
  model: "User",
  field: "userId",
  startAt: 1, //시작
  increment: 1, // 증가
})

module.exports = mongoose.model("User", UserSchema)
