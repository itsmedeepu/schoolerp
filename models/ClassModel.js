const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
  classname: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  },
});

const ClassModel = mongoose.model("Class", ClassSchema);
module.exports = ClassModel;
