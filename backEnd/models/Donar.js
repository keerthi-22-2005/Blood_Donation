const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User schema
    gender:{type:String,required:true},
    age: { type:Number,required:true},
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    anyDiseases:{type:String,required:true},
    anyAllergy :{type:String,required:true},
});

module.exports = mongoose.model("Donor", donorSchema);
