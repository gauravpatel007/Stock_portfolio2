const Holding = require("../models/Holding");
const Transaction = require("../models/Transaction");

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
    const { symbol, quantity, avgPrice, currentPrice, sector, assetType } = req.body;

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
      assetType: assetType || "Stocks",
    });

    await Transaction.create({
      user: req.user.id,
      symbol: holding.symbol,
      type: "BUY",
      quantity: holding.quantity,
      price: holding.avgPrice,
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
    const { symbol, quantity, avgPrice, currentPrice, targetPercentage, sector, assetType } = req.body;

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
    if (assetType !== undefined) holding.assetType = assetType;

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

// @desc    Handle Buy/Sell transaction on an existing holding
// @route   POST /api/holdings/:id/transaction
const handleTransaction = async (req, res) => {
  try {
    const { type, quantity, price } = req.body;
    
    if (!type || !quantity || !price) {
      return res.status(400).json({ message: "Please provide type, quantity, and price" });
    }

    const holding = await Holding.findById(req.params.id);

    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    if (holding.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const transQty = Number(quantity);
    const transPrice = Number(price);

    if (type === "BUY") {
      const newQty = holding.quantity + transQty;
      const newAvgPrice = ((holding.quantity * holding.avgPrice) + (transQty * transPrice)) / newQty;
      holding.quantity = newQty;
      holding.avgPrice = newAvgPrice;
      holding.currentPrice = transPrice; // Optionally update current price
    } else if (type === "SELL") {
      if (transQty > holding.quantity) {
        return res.status(400).json({ message: "Cannot sell more than you hold" });
      }
      
      holding.quantity -= transQty;
      holding.currentPrice = transPrice; // Optionally update current price
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Record the transaction
    await Transaction.create({
      user: req.user.id,
      symbol: holding.symbol,
      type,
      quantity: transQty,
      price: transPrice,
    });

    if (holding.quantity <= 0) {
      await holding.deleteOne();
      res.json({ message: "Holding sold completely and removed" });
    } else {
      const updatedHolding = await holding.save();
      res.json(updatedHolding);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error processing transaction" });
  }
};

module.exports = {
  getHoldings,
  addHolding,
  updateHolding,
  deleteHolding,
  searchTicker,
  handleTransaction,
};
