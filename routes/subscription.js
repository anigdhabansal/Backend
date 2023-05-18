const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const Subscription = require('../models/SubscriptionSchema');
const Trainee = require('../models/Trainee');
const Trainer = require('../models/Trainer');
const fetchtrainee = require('../middleware/fetchtrainee');

router.post('/buySubscription',fetchtrainee,async (req, res) => {
  try {
    const { plan } = req.body;
    const traineeId = req.traineeId;
    const trainee = await Trainee.findById(traineeId);
    const traineeid = trainee._id;
    if (!trainee) {
      return res.status(404).json({ error: 'Trainee not found' });
    }

    const Subs = await Subscription.findOne({ trainee: traineeid, isActive: true });
    if (Subs) {
      return res.status(400).json({ message: 'You already have an active subscription' });
    }

    let trainer = null;
    if (plan===  'platinum') {
      trainer = await Trainer.findOne({ experience: { $gte: 5 }, expertise: 'gym' });
      console.log(trainer);
    } else {
      const gymTrainer = await Trainer.findOne({experience: {$lte: 5}, expertise: 'gym' });  //less than 5
      if (gymTrainer) {
        trainer = gymTrainer._id;
      }
    }

    const duration =
        plan === 'silver'
        ? 30
        : plan === 'gold'
        ? 90
        : 180;

    const sessions =
      plan === 'silver'
        ? 2
        : plan === 'gold'
        ? 10
        : 999;

        const price = 
        plan === 'silver'
        ? 500
        : plan === 'gold'
        ? 1200
        : 5000;


    const subscription = new Subscription({
      name: plan,
      price: price,
      duration: duration,
      sessions: sessions,
      trainer: trainer,
      trainee: traineeid,
      expiry: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      isActive: true
    });

    await subscription.save();

    return res.status(201).json({message: 'success'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

