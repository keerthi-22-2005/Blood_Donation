const express = require("express");
const Hospital = require("../models/Hospital");
const router = express.Router();

// Add a new hospital
router.post("/add-hospital", async (req, res) => {
  try {
    const { photo, name, location, contact, website, bloodGroupsAccepted } = req.body;

    // Validate required fields
    if (!name || !location || !website || !Array.isArray(bloodGroupsAccepted) || bloodGroupsAccepted.length === 0) {
      return res.status(400).json({ message: "Invalid hospital data" });
    }

    const newHospital = new Hospital({
      photo,
      name,
      location,
      contact,
      website,
      bloodGroupsAccepted: bloodGroupsAccepted.map(bg => bg.toUpperCase()) // Normalize blood groups
    });

    await newHospital.save();
    res.status(201).json({ message: "Hospital added successfully", hospital: newHospital });
  } catch (err) {
    console.error("Error adding hospital:", err);
    res.status(500).json({ message: "Error adding hospital", error: err.message });
  }
});

// Get hospitals based on blood group
router.get("/hospital-blood", async (req, res) => {
  try {
    const { bloodGroup } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({ message: "Blood group is required" });
    }

    const formattedBloodGroup = bloodGroup.toUpperCase();

    const hospitals = await Hospital.find({
      bloodGroupsAccepted: { $in: [formattedBloodGroup] } // Corrected query syntax
    });

    if (hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found for this blood group" });
    }

    res.status(200).json(hospitals);
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ message: "Error fetching hospitals", error: err.message });
  }
});

router.get("/list", async (req, res) => {
  try {
    const hospitals = await Hospital.find(); // Fetch hospitals from database
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching hospitals" });
  }
});

module.exports = router;
