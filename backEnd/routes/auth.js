const express = require("express");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ username, email, password: hashedPassword, mobile });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = generateToken(user._id);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, mobile: user.mobile } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
