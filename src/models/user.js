const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const { Schema } = mongoose
const userSchema = new Schema(
  {
    userId: { type: Number, unique: true, default: 0 },
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    provider: {
        type: String,
        require: true,
      },
      snsId: {
        type: String,
        require: true,
        unique: true,
      },
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(AutoIncrement, { start_seq: 1, inc_field: "userId" })

module.exports = mongoose.model("User", userSchema)
