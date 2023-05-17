const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  expertise: {
    type: String,
    required: true,
  },
  experience:{
    type:Number,
    required:true
  },
  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('trainer', TrainerSchema);

