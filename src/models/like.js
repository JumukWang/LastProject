const mongoose = require('mongoose');

const { Schema } = mongoose;
const likeSchema = new Schema(
  {
    userId: {
      type: Number,
    },
    isLiked: {
      type: Array,
      default: false,
    },
    likeList: {
      type: Array,
      default: 0,
    }
  },
  { timestamps: true },
);

const Like = mongoose.model('Like', likeSchema);
module.exports = { Like };
