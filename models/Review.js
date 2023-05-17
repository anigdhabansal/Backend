const mongoose=require('mongoose');
// import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    trainee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'trainee'
    },
  title:{
      type:String,
      required:true
  },
  description:{
    type:String,
    required:true,
   
},
tag:{
    type:String,
    default:"general"
},
date:{
    type:Date,
    default:Date.now
},
});

module.exports= mongoose.model('review',ReviewSchema)