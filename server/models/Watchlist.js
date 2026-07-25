const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ["ABOVE", "BELOW"],
      default: "ABOVE",
    },
    frequency: {
      type: String,
      enum: ["ONCE", "EVERY_TIME"],
      default: "EVERY_TIME",
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);
