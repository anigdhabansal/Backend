const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const Trainer = require('../models/Trainer');
const Trainee = require('../models/Trainee');
const Subscription = require('../models/SubscriptionSchema');
const Session = require('../models/Sessions');
const fetchtrainee = require('../middleware/fetchtrainee');

// Rest of your code...

//const { computeHeadingLevel } = require('@testing-library/react');



router.post('/booksession',fetchtrainee,async (req, res) => {
    try {
      const {activity, slot, date } = req.body;

        const traineeId = req.traineeId;
        const trainee = await Trainee.findById(traineeId);
        const traineeid = trainee._id;
  
      // Find the subscription for the user
      const subscription = await Subscription.findOne({trainee:trainee._id,isActive:true });
      // console.log(userId)
      // console.log(subscription.isActive)
      if (!subscription) {
        return res.status(400).json({ message: "User does not have an active subscription" });
      }
  
      // Check if the user has any remaining sessions in their subscription
      if (subscription.sessions < 1) {
        return res.status(400).json({ message: "User does not have any remaining sessions in their subscription" });
      }
  
      // Find the session to book
      const sess = await Session.findOne({traineeid,activity, slot, date });
      if (sess) {
        return res.status(400).json({ message: "you have already booked the session" });
      }
      
      // Check if the session has reached its maximum capacity
      const sessionCount = await Session.countDocuments({ activity: activity, slot: slot, date: date});
      if (sessionCount >= 2) {
        return res.status(400).json({ message: "Slot not available" });
      }
  
      // Find a trainer with expertise in the session's activity
  
  
      // Update the session with the user and decrement the subscription's sessionsLeft count

      const session = new Session({
      userId :traineeid,
      activity :activity,
      slot : slot,
      date :date,
      trainerId :null,
      })

      if (sessionCount === 0) {
        const trainer = await Trainer.findOne({ expertise: activity });
        if (!trainer) {
          return res.status(400).json({ message: "No trainer available" });
        }
        session.trainerId = trainer._id;
      } else {
        // get the trainer assigned to this slot and assign the same trainer to this session
        const assignedSession = await Session.findOne({ activity: activity, slot: slot, date: date});
        session.trainerId = assignedSession.trainerId;
      }
  
      await session.save();
      const subscriptions = await Subscription.findOne({trainee:traineeid,isActive:true });
      subscriptions.sessions -= 1;
      await subscriptions.save();
  
      res.json({ message: "Session booked successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  })



  // router.post('/cancelSession/:id',fetchtrainee, async (req, res) => {
  //   try {
  //     //const { sessionId } = req.body;

  //     let sessionId = req.params.id;

  //     const traineeId = req.traineeId;
  //     const trainee = await Trainee.findById(traineeId);
  //     const traineeid = trainee._id;
  
  //     // Find the session to cancel
  //     const session = await Session.findById(sessionId);
  //     if (!session) {
  //       return res.status(400).json({ message: "Session not found" });
  //     }
      
  //     const subscription = await Subscription.findOne({ trainee: traineeid, isActive: true });
  //     // Check if the user owns the session
  //     if (session.userId.toString() !== new mongoose.Types.ObjectId(traineeid).toString()) {
  //       return res.status(400).json({ message: "you do not own the session" });
  //     }
  
  //     // Calculate the time difference between the session start time and the current time
  //     const sessionStart = new Date(`${session.date} ${session.slot}`);
  //     const timeDiff = sessionStart.getTime() - Date.now();
  
  //     // Check if the time difference is less than 48 hours (172800000 milliseconds)
  //     if (timeDiff < 172800000) {
  //       return res.status(400).json({ message: "Session cannot be cancelled within 48 hours of its start time" });
  //     }
  
  //     // Reset the session properties and save the changes to the Session collection
  //     //session.userId = null;
  //     //session.trainerId = null;
      
  //     session.isAvailable = true;
  //     await session.save();
  
  //     // Increment the subscription's sessionsLeft count and save the changes to the Subscription collection
  //     subscription.sessions += 1;
  //     await subscription.save();
  
  //     res.json({ message: "Session cancelled successfully" });

  //     await Session.deleteOne({_id: sessionId });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Server Error" });
  //   }
  // })

  // router.get("/getsessions",fetchtrainee,async (req, res) => {
  //   try {
  //     const traineeId = req.traineeId;
  //     const trainee = await Trainee.findById(traineeId);
  //     const traineeid = trainee._id;
  //     const sessions = await Session.find({ userId: traineeid });
  //     res.json(sessions);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send("Server error");
  //   }
  //});


  router.post('/cancelSession/:id', fetchtrainee, async (req, res) => {
    try {
      const sessionId = req.params.id;
      const traineeId = req.traineeId;
  
      const trainee = await Trainee.findById(traineeId);
      if (!trainee) {
        return res.status(400).json({ message: 'Trainee not found' });
      }
  
      const session = await Session.findOne({ _id: sessionId, userId: traineeId });
      if (!session) {
        return res.status(400).json({ message: 'Session not found or you do not own this session' });
      }
  
      const subscription = await Subscription.findOne({ trainee: traineeId, isActive: true });
      if (!subscription) {
        return res.status(400).json({ message: 'Subscription not found' });
      }
  
      const sessionStart = new Date(`${session.date} ${session.slot}`);
      const timeDiff = sessionStart.getTime() - Date.now();
  
      if (timeDiff < 172800000) {
        return res.status(400).json({ message: 'Session cannot be cancelled within 48 hours of its start time' });
      }
  
      session.isAvailable = true;
      await session.save();
  
      subscription.sessions += 1;
      await subscription.save();
      await Session.deleteOne({ _id: sessionId});
  
      res.json({ message: 'Session cancelled successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  
  router.get('/getsessions', fetchtrainee, async (req, res) => {
    try {
      const traineeId = req.traineeId;
      const sessions = await Session.find({ userId: traineeId }).populate('trainerId', 'name');
      const updatedSessions = sessions.map((session) => ({
        _id: session._id,
        trainername: session.trainerId.name,
        activity: session.activity,
        slot: session.slot,
        date: session.date,
        isAvailable: session.isAvailable,
      }));
      res.json(updatedSessions);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  


  // router.get("/getsessions", fetchtrainee, async (req, res) => {
  //   try {
  //     const traineeId = req.traineeId;
  //     const sessions = await Session.find({ userId: traineeId }).populate(
  //       "trainerId",
  //       "name"
  //     );
  //     const updatedSessions = sessions.map((session) => ({
  //       trainername: session.trainerId.name,
  //       activity: session.activity,
  //       slot: session.slot,
  //       date: session.date,
  //       isAvailable: session.isAvailable,
  //     }));
  //     res.json(updatedSessions);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send("Server error");
  //   }
  // });
  
  

// Rest of your code...

  


  router.get('/getsubscriptions',fetchtrainee,async (req, res) => {
    try {
      checkSubscription();
      const traineeId = req.traineeId;
      const trainee = await Trainee.findById(traineeId);
      const traineeid = trainee._id;
      const subscriptions = await Subscription.find({ trainee: traineeid });
      res.json(subscriptions);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

 

const checkSubscription = async () => {
  try {
    const subscriptions = await Subscription.find();
    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return;
    }

    for (const subscription of subscriptions) {
      if (subscription.expiry < new Date()) {
        subscription.isActive = false;
        await subscription.save();
      }
    }
    console.log('Subscriptions updated successfully');
  } catch (error) {
    console.error(error);
  }
};
  
module.exports = router;