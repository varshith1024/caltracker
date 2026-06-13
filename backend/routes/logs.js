const express = require("express");
const router = express.Router();
const FoodLog = require("../models/FoodLog");
const { protect } = require("../middleware/auth");

// Get today's log
router.get("/", protect, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const log = await FoodLog.findOne({ user: req.user._id, date });
    res.json(log || { date, entries: [], totalCalories: 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get history (last 30 days)
router.get("/history", protect, async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user._id })
      .sort({ date: -1 }).limit(30);
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add food entry
router.post("/entry", protect, async (req, res) => {
  try {
    const { foodName, emoji, grams, calories } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    const entry = { foodName, emoji, grams, calories };

    let log = await FoodLog.findOne({ user: req.user._id, date });
    if (log) {
      log.entries.push(entry);
      log.totalCalories = log.entries.reduce((a, e) => a + e.calories, 0);
      await log.save();
    } else {
      log = await FoodLog.create({
        user: req.user._id, date, entries: [entry], totalCalories: calories
      });
    }
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete entry
router.delete("/entry/:entryId", protect, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const log = await FoodLog.findOne({ user: req.user._id, date });
    if (!log) return res.status(404).json({ message: "Log not found" });
    log.entries = log.entries.filter(e => e._id.toString() !== req.params.entryId);
    log.totalCalories = log.entries.reduce((a, e) => a + e.calories, 0);
    await log.save();
    res.json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;