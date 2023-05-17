const express = require('express');
const router = express.Router();
const Userdb = require('../models/Attendance');

router.post('/addattendance',(req, res) => {
    const { name, email, date, hours } = req.body;
    const progress = isNaN(hours) ? 0 : Number(hours);
  
    Userdb.findOne({ email })
      .then(user => {
        if (user) {
          // user.Hours = Hours;
          user.progress += progress;
          console.log(user.progress);
          user.save()
            .then(() => res.json('Attendance updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        } else {
          const newUser = new Userdb({
            name,
            email,
            Date: date,
            Hours: hours,
            progress : progress
          });
          newUser.save()
            .then(() => res.json('Attendance added!'))
            .catch(err => res.status(400).json('Error: ' + err));
        }

      })
      .catch(err => res.status(400).json('Error: ' + err));
      
    
  });
  

module.exports = router;
