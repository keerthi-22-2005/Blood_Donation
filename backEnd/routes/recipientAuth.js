const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/authMiddleware");
const Recipient = require("../models/Recipient");
const Hospital = require("../models/Hospital"); // Import Hospital Model

const router = express.Router();

//  Request or Update Blood Request
router.post("/request-blood", authMiddleware, async (req, res) => {
    try {
        const { age, bloodGroup, address, contactNumber, requiredDate, requiredTime, hospitalId } = req.body;

        console.log("📌 Received Blood Request Data:", req.body);

        // Validate input fields
        if (!age || !bloodGroup || !address || !contactNumber || !requiredDate || !requiredTime) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the user already has a blood request
        let recipient = await Recipient.findOne({ user: req.user.id });

        if (recipient) {
            // Update existing request
            recipient.age = age;
            recipient.bloodGroup = bloodGroup;
            recipient.address = address;
            recipient.contactNumber = contactNumber;
            recipient.requiredDate = requiredDate;
            recipient.requiredTime = requiredTime; // ✅ Store required time
            recipient.hospital = hospitalId || null;
            recipient.status = hospitalId ? "Processing" : "Pending";

            await recipient.save();
            return res.status(200).json({ message: "Blood request updated successfully", recipient });
        }

        // Create new request if not found
        recipient = new Recipient({
            user: req.user.id,
            age,
            bloodGroup,
            address,
            contactNumber,
            requiredDate,
            requiredTime, // ✅ Store required time
            hospital: hospitalId || null,
            status: hospitalId ? "Processing" : "Pending",
        });

        await recipient.save();
        return res.status(201).json({ message: "Blood request submitted successfully", recipient });

    } catch (error) {
        console.error("❌ Error submitting blood request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  Get Recipient Request Details
router.get("/request-details", authMiddleware, async (req, res) => {
    try {
        const recipient = await Recipient.findOne({ user: req.user.id })
            .populate("user", "username email mobile")
            .populate("hospital", "name location");

        if (!recipient) {
            return res.status(404).json({ message: "No blood request found for this user" });
        }

        return res.status(200).json({
            message: "Recipient details fetched successfully",
            recipient,
        });

    } catch (error) {
        console.error("❌ Error fetching blood request details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  Assign Hospital to a Recipient's Request
router.put("/assign-hospital/:requestId", authMiddleware, async (req, res) => {
    try {
        const { requestId } = req.params;
        const { hospitalId } = req.body;

        if (!hospitalId) {
            return res.status(400).json({ message: "Hospital ID is required." });
        }

        const recipient = await Recipient.findById(requestId);
        if (!recipient) {
            return res.status(404).json({ message: "Blood request not found." });
        }

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }

        //  Update recipient's hospital field correctly
        recipient.hospital = hospitalId;
        recipient.status = "Processing"; // Update status when assigned

        await recipient.save();

        res.status(200).json({ message: "Hospital assigned successfully.", recipient });

    } catch (error) {
        console.error("❌ Error assigning hospital:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
