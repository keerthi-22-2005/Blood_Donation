const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  requiredDate: { type: Date, required: true },
  requiredTime: { type: String, required: true }, // ✅ Added requiredTime field
  status: { type: String, enum: ["Pending", "Processing", "Approved"], default: "Pending" },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
});

module.exports = mongoose.model("Request", requestSchema);
