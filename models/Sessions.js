const mongoose = require("mongoose")
const sessionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainee",
      default: null,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainer",
    },
    activity: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  });
  
  module.exports = mongoose.model("Sessions",sessionSchema);