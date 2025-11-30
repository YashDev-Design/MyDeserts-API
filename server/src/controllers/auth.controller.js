import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/email.js";

// Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: "customer",
    });

    await user.save();

    // Fire-and-forget welcome email (do not block response if it fails)
    sendWelcomeEmail(user.email, user.username).catch((err) => {
      console.error("Failed to send welcome email:", err.message);
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (CUSTOMER)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(403).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = generateToken(admin);

    res.json({
      message: "Admin login successful",
      token,
      role: admin.role,
      username: admin.username,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
