const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { protect } = require("../middleware/auth");

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Register hit:", req.body); // ← add this

    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password min 6 chars" });

    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: "Username already taken" });

    const user = await User.create({ username, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      profileComplete: false,
      token: genToken(user._id),
    });

  } catch (err) {
    console.error("❌ Register error:", err.message); // ← and this
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Login hit:", req.body);

    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      username: user.username,
      profile: user.profile,
      profileComplete: user.profileComplete,
      token: genToken(user._id),
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get me
router.get("/me", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    profile: req.user.profile,
    profileComplete: req.user.profileComplete,
  });
});

module.exports = router;