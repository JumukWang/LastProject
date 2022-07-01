const mongoose = require("mongoose")


const { Schema } = mongoose
const kakaoSchema = new Schema(
  {
    email: {
        type: String,
    },
    nickname: {
        type: String,
    },
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

module.exports = mongoose.model("kakao", kakaoSchema)
