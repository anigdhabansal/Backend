const mongoose=require('mongoose');

const { Schema } = mongoose;

const ContactSchema = new Schema({
  name:{
      type:String,
      required:true
  },
  email:{
    type:String,
    required:true,
    // unique:true
},
subject:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
date:{
    type:Date,
    default:Date.now
},
});
const Contact= mongoose.model('contact',ContactSchema)
module.exports=Contact