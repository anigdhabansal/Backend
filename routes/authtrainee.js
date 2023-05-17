const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router()
const Trainee = require('../models/Trainee')
const Profile = require('../models/TraineeProfile')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// const {is} = require('express/lib/request');
const fetchtrainee=require("../middleware/fetchtrainee")
const JWT_SECRET = "Abhiisgood$hi"

// Route 1 create a user doenst require auth api/auth/createuser no login required
router.post('/createuser', [
    body('name', 'Name must be 3character long').isLength(
        {min: 3}
    ),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be  3 character long').isLength(
        {min: 3}
    )
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {

        let trainee = await Trainee.findOne({email: req.body.email});
        if (trainee) {
            
            return res.status(400).json({message: "Sorry email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        trainee= await Trainee.create({name: req.body.name, password: secPass, email: req.body.email,isSubscribed:req.body.isSubscribed})
        await createProfile(trainee.id);
        const data = {
            trainee: {
                id: trainee.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success,authtoken})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})


const createProfile = async (userId) => {
    try {
        await Profile.create({
            userId,
            name: null,
            email: null,
            gender: null,
            dob: null,
            height: null,
            weight: null,
            goal: null,
            body_temp:null,
            pulse_rate:null,
            resp_rate:null,
            blood_pressure:null

        });
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to create profile for user');
    }
};

//  Route 2 Authenticate a user doenst require auth api/auth/login, no login required
router.post('/login', [

    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cant not be blank').exists()
], async (req, res) => {
let success=false;
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        // console.log("jhi")
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    try {
        let trainee = await Trainee.findOne({email});
        if (! trainee) {
            return res.status(400).json({message: "please try to login with correct credentials"})
        }
        const passwordCompare = await bcrypt.compare(password, trainee.password);
        if (! passwordCompare) {
            return res.status(400).json({message: "please try to login with correct credentials"})
        }
        const data = {
            trainee: {
                id: trainee.id
            }
        }
        // console.log("hii")
        success=true;
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({success,authtoken,message: "Login Successful"})
        

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})


//  Route 3 Get logged user details using POST  auth api/auth/getuser,  login required
router.post('/getuser', fetchtrainee,async (req, res) => {
try {
    const traineeId=req.traineeId
    const trainee =await Trainee.findById(traineeId).select("-password")
    res.send(trainee)
} catch (error) {
    
    console.error(error.message);
    res.status(500).send("Internal Server Error")
}
})
module.exports = router
