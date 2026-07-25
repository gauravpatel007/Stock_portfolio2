const Holding = require("../models/Holding");

// @desc    Get all holdings
// @route   GET /api/holdings
const getHoldings = async (req, res) => {
  try {
    const holdings = await Holding.find({ user: req.user.id });
    res.json(holdings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching holdings" });
  }
};

// @desc    Add a new holding
// @route   POST /api/holdings
const addHolding = async (req, res) => {
  try {
    const { symbol, quantity, avgPrice, currentPrice, sector } = req.body;

    if (!symbol || !quantity || !avgPrice || !currentPrice) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const holding = await Holding.create({
      user: req.user.id,
      symbol,
      quantity,
      avgPrice,
      currentPrice,
      sector: sector || "Other",
    });

    res.status(201).json(holding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error adding holding" });
  }
};

// @desc    Update a holding
// @route   PUT /api/holdings/:id
const updateHolding = async (req, res) => {
  try {
    const { symbol, quantity, avgPrice, currentPrice, targetPercentage, sector } = req.body;

    const holding = await Holding.findById(req.params.id);

    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    // Make sure the logged in user matches the holding user
    if (holding.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    if (symbol !== undefined) holding.symbol = symbol;
    if (quantity !== undefined) holding.quantity = quantity;
    if (avgPrice !== undefined) holding.avgPrice = avgPrice;
    if (currentPrice !== undefined) holding.currentPrice = currentPrice;
    if (targetPercentage !== undefined) holding.targetPercentage = targetPercentage;
    if (sector !== undefined) holding.sector = sector;

    const updatedHolding = await holding.save();

    res.json(updatedHolding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error updating holding" });
  }
};

// @desc    Delete a holding
// @route   DELETE /api/holdings/:id
const deleteHolding = async (req, res) => {
  try {
    const holding = await Holding.findById(req.params.id);

    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    // Make sure the logged in user matches the holding user
    if (holding.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await holding.deleteOne();
    res.json({ message: "Holding removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error deleting holding" });
  }
};

// @desc    Search tickers via Yahoo Finance
// @route   GET /api/holdings/search/:query
const searchTicker = async (req, res) => {
  try {
    const { query } = req.params;
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`;
    
    // Use native fetch if available, else fallback to something else, but node 18+ has fetch.
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Yahoo API responded with status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Search Ticker Error:", error);
    res.status(500).json({ message: "Server Error fetching ticker suggestions" });
  }
};

module.exports = {
  getHoldings,
  addHolding,
  updateHolding,
  deleteHolding,
  searchTicker,
};
