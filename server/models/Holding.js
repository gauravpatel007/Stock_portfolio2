const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    avgPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    targetPercentage: {
      type: Number,
      default: 0,
    },
    sector: {
      type: String,
      default: "Other",
    },
    assetType: {
      type: String,
      enum: ["Stocks", "ETF", "Commodities", "Crypto"],
      default: "Stocks",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Holding", holdingSchema);
