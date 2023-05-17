const mongoose =require('mongoose');
const { options } = require('nodemon/lib/config');
PORT=8080
API_URL = "/api/v1"


const mongoURI="mongodb+srv://anigdhabansal:hello123@cluster0.zqfndbm.mongodb.net/NoVaFit?retryWrites=true&w=majority"

const connectToMongo=()=>{

    if(mongoose.connect(mongoURI))
    console.log("connected")
    
}




module.exports=connectToMongo