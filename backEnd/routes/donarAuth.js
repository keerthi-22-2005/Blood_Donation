const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/authMiddleware"); // Authentication Middleware
const Donor = require("../models/Donar");

const router = express.Router();

// Book an Appointment (Donor Registration)
router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        const { gender, age, bloodGroup, address, anyDiseases, anyAllergy } = req.body;

        // Check if the user already has an appointment
        const existingDonor = await Donor.findOne({ user: req.user.id });
        if (existingDonor) {
            return res.status(400).json({ message: "You have already booked an appointment." });
        }

        // Create a new donor entry
        const newDonor = new Donor({
            user: req.user.id,
            gender,
            age,
            bloodGroup,
            address,
            anyDiseases,
            anyAllergy,
        });

        await newDonor.save();

        res.status(201).json({ message: "Appointment booked successfully", donor: newDonor });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Donor Appointment Details (Protected Route)
router.get("/appointment-details", authMiddleware, async (req, res) => {
    try {
        const donor = await Donor.findOne({ user: req.user.id }).populate("user", "username email mobile");
        if (!donor) {
            return res.status(404).json({ message: "No appointment found" });
        }
        res.json(donor);
    } catch (error) {
        console.error("Error fetching appointment details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
