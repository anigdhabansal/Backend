const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Payment = require('../models/Payment');
const handleSubscription = require('./subscription');

const instance = new Razorpay({
  key_id: "rzp_test_YlxTdTGYq82Ceb",
  key_secret: "DL8A64vNjo1YPsO3zp5cMgTs",
});

router.get("/", (req, res) => {
  let amount;
  // res.send("hello")
  const plan = req.query.plan; // Get the selected plan from the query parameter

  if (plan === "Gold") {
    amount = 1200 * 100; // Set amount to 1200 INR for Gold plan
  } else if (plan === "Silver") {
    amount = 500 * 100; // Set amount to 500 INR for Silver plan
  } else if (plan === "Platinum") {
    amount = 2500 * 100; // Set amount to 2500 INR for Platinum plan
  } else {
    amount = 500 * 100; // Default amount is 500 INR
  }

  var options = {
    amount: amount,
    currency: "INR",
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      return res.status(500).send("Unable to create order");
    } else {
      console.log(order);
      return res.render("checkout", {
        amount: order.amount,
        order_id: order.id,
      });
    }
  });
});

router.post("/pay-verify", async (req, res) => {
  // console.log(req.body);
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "DL8A64vNjo1YPsO3zp5cMgTs")
    .update(body.toString())
    .digest("hex");
  // console.log("sig" + req.body.razorpay_signature);
  // console.log("sig" + expectedSignature);

  if (expectedSignature === req.body.razorpay_signature) {
    console.log("Payment Success");
    // console.log(req.body);
    const payment = new Payment({
      orderId: req.body.razorpay_order_id,
      paymentId: req.body.razorpay_payment_id,
      signature: req.body.razorpay_signature,
      status: "success",
      name: req.body.razorpay_name,
      email: req.body.razorpay_email,
      plan: req.body.razorpay_plan
    })
    // console.log(payment.plan)
    await payment.save();
    const paymentId = payment.paymentId;
    const email = payment.email;
    handleSubscription(email,paymentId);
    return res.send("Payment successful");
  } else {
    console.log("Payment Fail");
    const payment = new Payment({
      orderId: req.body.razorpay_order_id,
      paymentId: req.body.razorpay_payment_id,
      signature: req.body.razorpay_signature,
      status: "fail",
      name: razorpay_name,
      email: razorpay_email,
      plan: razorpay_plan,
    });
    await payment.save();
    return res.status(500).send("Payment failed");
  }
});




module.exports = router;

