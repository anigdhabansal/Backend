const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router()
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// const {is} = require('express/lib/request');
const fetchadmin=require("../middleware/fetchadmin")
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

        let admin = await Admin.findOne({email: req.body.email});
        if (admin) {
            return res.status(400).json({message: "Sorry email already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        admin= await Admin.create({name: req.body.name, password: secPass, email: req.body.email})
        const data = {
            admin: {
                id: admin.id
            }
        }
        success=true;

        const authtoken = jwt.sign(data, JWT_SECRET);

        res.json({success,authtoken})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

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
        let admin = await Admin.findOne({email});
        if (! admin) {
            return res.status(400).json({message: "please try to login with correct credintails"})
        }
        const passwordCompare = await bcrypt.compare(password, admin.password);
        if (! passwordCompare) {
            return res.status(400).json({message: "please try to login with correct credintails"})
        }
        const data = {
            admin: {
                id: admin.id
            }
        }
        // console.log("hii")
        success=true;
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({success,authtoken,message: "Login Successful "})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})


//  Route 3 Get logged user details using POST  auth api/auth/getuser,  login required
router.post('/getuser', fetchadmin,async (req, res) => {
try {
     const adminId=req.admin.id
    const admin =await Admin.findById(adminId).select("-password")
    res.send(admin)
} catch (error) {
    
    console.error(error.message);
    res.status(500).send("Internal Server Error")
}
})
module.exports = router
