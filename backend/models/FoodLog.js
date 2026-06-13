const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  emoji: { type: String, default: "🍽️" },
  grams: { type: Number, required: true },
  calories: { type: Number, required: true },
  loggedAt: { type: Date, default: Date.now }
});

const foodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  entries: [entrySchema],
  totalCalories: { type: Number, default: 0 }
}, { timestamps: true });

foodLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("FoodLog", foodLogSchema);