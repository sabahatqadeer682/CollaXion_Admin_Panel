// routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Hardcoded credentials (you can move these to environment variables)
const COCURRICULAR_USERNAME = process.env.COCU_USERNAME || "cocu";
const COCURRICULAR_PASSWORD = process.env.COCU_PASSWORD || "cocu123";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Login endpoint for CoCurricular
router.post("/cocurricular/login", asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ 
            message: "Username and password are required" 
        });
    }

    // Check credentials
    if (username === COCURRICULAR_USERNAME && password === COCURRICULAR_PASSWORD) {
        // Create JWT token
        const token = jwt.sign(
            { 
                username, 
                role: "cocurricular",
                userId: "cocu-admin-1" 
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Return user info and token
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                username,
                name: "Prof. Sarah Ahmed",
                email: "sarah.ahmed@collxion.edu",
                role: "Co-Curricular Incharge"
            }
        });
    } else {
        return res.status(401).json({ 
            message: "Invalid username or password" 
        });
    }
}));

// Verify token endpoint
router.get("/verify", asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}));

export default router;