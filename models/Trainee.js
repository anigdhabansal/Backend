const mongoose=require('mongoose');

const { Schema } = mongoose;

const TraineeSchema = new Schema({
  name:{
      type:String,
      required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
// role: {
//     type: String,
//     enum: ['trainee', 'user'],
//     default: 'user'
//   },

date:{
    type:Date,
    default:Date.now
},
});
module.exports= mongoose.model('trainee',TraineeSchema)