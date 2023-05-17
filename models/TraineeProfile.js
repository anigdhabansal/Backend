const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfileSchema = new Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trainee',
        default:null
    },
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    gender:{
        type:String,
        default:null
    },
    dob:{
        type:Date,
        default:null
    },
    height:{
        type:Number,
        default:null
    },
    weight:{
        type:Number,
        default:null
    },
    goal:{
        type:String,
        default:null
    },
	body_temp: { 
        type: Number,
        default:null
    },

	pulse_rate: { 
        type: Number,
        default:null
    },

    resp_rate: { 
        type: Number, 
        default:null 
        },

    blood_pressure: {
        type: Number,
        default:null 
    }
	

});

module.exports = mongoose.model('Profile',ProfileSchema);