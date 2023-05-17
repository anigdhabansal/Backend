const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
      orderId: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String,
        required: true,
      },
      signature: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["success", "fail"],
        required: true,
      },
      name: {
        type: String,
      },
      plan: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Payment", paymentSchema);  