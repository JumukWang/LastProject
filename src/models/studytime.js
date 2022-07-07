const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment")
autoIncrement.initialize(mongoose.connection)

const { Schema } = mongoose;
const studyTimeSchema = new Schema({
    studytime : {
        type: String,
    },
    timeId : {
        type: Number,
        default: 0,
    },
    userId: {
        type: Number,
        unique: true,
    },
    startTime : {
        type: String,
    },
    outTime : {
        type: String,
    },
    day : {
        type: Number,
    },
    inTimestamp : {
        type: Number,
    },
    outTimestamp: {
        type: Number,
    },
    timedif: {
        type: Number,
    }
});

studyTimeSchema.plugin(autoIncrement.plugin, {
    model: "Time",
    field: "timeId",
    startAt: 1, //시작
    increment: 1, // 증가
  })

module.exports = mongoose.model("studyTime", studyTimeSchema);
