const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['platinum', 'gold', 'silver']
  },
  price: {
    type: Number,
    required:true,
    min: 0
  },
  duration: {
    type: Number,

  },
  sessions: {
    type: Number,

  },
  date: {
    type: Date,
    default: Date.now
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trainer'
  },
  trainee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trainee',
    required: true
  },
  expiry: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
