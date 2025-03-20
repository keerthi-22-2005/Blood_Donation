const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String },
    photo: { type: String },
    website: { type: String, required: true },
    bloodGroupsAccepted: { type: [String], required: true } // Added blood groups field
});

module.exports = mongoose.model("Hospital", HospitalSchema);
