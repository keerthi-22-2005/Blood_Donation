const mongoose = require("mongoose")
require("dotenv").config()
const connectDB= async ()=>{
    try{
        await mongoose.connect("mongodb+srv://keerthi:keerthi@mongodb-1.wo3j6.mongodb.net/blooddonation?retryWrites=true&w=majority&appName=MongoDB-1")
            .then(()=>{
                console.log("Mongodb connected successfully")
            })
    }
    catch(err){
        console.log("Error while connecting with DB", err)
    }
}
module.exports=connectDB
