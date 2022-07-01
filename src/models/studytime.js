const mongoose = require("mongoose");

const { Schema } = mongoose;
const studyTimeSchema = new Schema({
    studytimeIn : {
        type: Number,
        required: true,
    }
    studytimeOut : {
        type: Number,
        required: true,
    }
});


module.exports = mongoose.model("studyTime", studyTimeSchema);
