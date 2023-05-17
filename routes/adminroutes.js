const express = require('express')
const mongoose = require("mongoose");
const router = express.Router();
const Trainer = require('../models/Trainer');
const Trainee = require('../models/Trainee');

// test comment 
router.get('/getTrainers', async (req,res) => {
try{
    const trainers = await Trainer.find();
    res.json(trainers);
}catch(err){
    res.status(400).send("No trainers found");
}
})


router.get('/getTrainees', async (req,res) => {
    try{
        const trainees = await Trainee.find();
        res.json(trainees);
    }catch(err){
        res.status(400).send("No trainees found");
    }
    })

module.exports = router;