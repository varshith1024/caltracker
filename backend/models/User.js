const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profile: {
      name: {
        type: String,
        default: "",
      },

      age: {
        type: Number,
        default: 0,
      },

      weight: {
        type: Number,
        default: 0,
      },

      heightCm: {
        type: Number,
        default: 0,
      },

      gender: {
        type: String,
        enum: ["male", "female"],
        default: "female",
      },

      goal: {
        type: Number,
        default: 1800,
      },
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);