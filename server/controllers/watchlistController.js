const Watchlist = require("../models/Watchlist");

// @desc    Get user watchlist
// @route   GET /api/watchlist
const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching watchlist" });
  }
};

// @desc    Add item to watchlist
// @route   POST /api/watchlist
const addWatchlistItem = async (req, res) => {
  try {
    const { symbol, targetPrice, condition, frequency, notes } = req.body;

    if (!symbol || !targetPrice) {
      return res.status(400).json({ message: "Symbol and target price are required" });
    }

    const item = await Watchlist.create({
      user: req.user.id,
      symbol: symbol.toUpperCase(),
      targetPrice: Number(targetPrice),
      condition: condition || "ABOVE",
      frequency: frequency || "EVERY_TIME",
      notes: notes || "",
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error adding to watchlist" });
  }
};

// @desc    Delete item from watchlist
// @route   DELETE /api/watchlist/:id
const deleteWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item removed from watchlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error removing watchlist item" });
  }
};

// @desc    Toggle/update watchlist item trigger status
// @route   PUT /api/watchlist/:id
const updateWatchlistItem = async (req, res) => {
  try {
    const item = await Watchlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (typeof req.body.active !== "undefined") {
      item.active = req.body.active;
    }

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating watchlist item" });
  }
};

module.exports = {
  getWatchlist,
  addWatchlistItem,
  deleteWatchlistItem,
  updateWatchlistItem,
};
