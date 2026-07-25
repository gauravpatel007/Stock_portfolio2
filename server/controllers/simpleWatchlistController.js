const SimpleWatchlist = require("../models/SimpleWatchlist");

// @desc    Get all simple watchlist items
// @route   GET /api/simple-watchlist
// @access  Private
const getSimpleWatchlist = async (req, res) => {
  try {
    const watchlist = await SimpleWatchlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a stock to simple watchlist
// @route   POST /api/simple-watchlist
// @access  Private
const addSimpleWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: "Please provide a stock symbol" });
    }

    // Check if already exists for this user
    const exists = await SimpleWatchlist.findOne({ user: req.user.id, symbol: symbol.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Stock already in your watchlist" });
    }

    const item = await SimpleWatchlist.create({
      user: req.user.id,
      symbol: symbol.toUpperCase()
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a stock from simple watchlist
// @route   DELETE /api/simple-watchlist/:id
// @access  Private
const deleteSimpleWatchlist = async (req, res) => {
  try {
    const item = await SimpleWatchlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    // Check for user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getSimpleWatchlist,
  addSimpleWatchlist,
  deleteSimpleWatchlist,
};
