const Transaction = require("../models/Transaction");

// @desc    Get all transactions
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching transactions" });
  }
};

module.exports = {
  getTransactions,
};
