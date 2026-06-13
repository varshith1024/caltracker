const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

function calcGoal({ weight, heightCm, age, gender }) {
  const bmr = gender === "female"
    ? 10 * weight + 6.25 * heightCm - 5 * age - 161
    : 10 * weight + 6.25 * heightCm - 5 * age + 5;
  return Math.round(Math.max(1200, bmr * 1.375));
}

router.put("/", protect, async (req, res) => {
  try {
    const { name, age, weight, heightCm, gender } = req.body;
    const goal = calcGoal({ weight, heightCm, age, gender });
    const user = await User.findByIdAndUpdate(req.user._id, {
      profile: { name, age, weight, heightCm, gender, goal },
      profileComplete: true
    }, { new: true }).select("-password");
    res.json({ profile: user.profile, profileComplete: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;