const mongoose=require('mongoose');

const { Schema } = mongoose;

const FaqSchema = new Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin'
    },
  question:{
    type:String,
    required:true,
    // unique:true
},
answer:{
    type:String,
    required:true
},
tag:{
    type:String,
    default:"general"
}
});
const Faq= mongoose.model('faq',FaqSchema)
module.exports=Faq