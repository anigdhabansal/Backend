const mongoose = require('mongoose');

var AttendanceSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    Date : {
        type : String,
        required : true,
    },
    Hours : {
        type  : Number,
        default: 0
    },
    // status : 
    // {
    //     type : String,
    // },
    progress: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Attendance',AttendanceSchema);
