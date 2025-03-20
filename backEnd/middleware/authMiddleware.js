const { validateToken } = require("../config/jwt");
const User = require("../models/User");

// General Authentication Middleware (Protects Routes)
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized user" });
    }
    try {
        const verify = validateToken(token.replace("Bearer ", ""));
        req.user = verify;

        // Check if the user exists in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        console.log("Error from authMiddleware:", err);
        res.status(400).json({ message: "Invalid token or expired" });
    }
};

module.exports = { authMiddleware };
