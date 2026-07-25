const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getHoldings,
  addHolding,
  updateHolding,
  deleteHolding,
  searchTicker,
  handleTransaction,
} = require("../controllers/holdingController");

router.route("/").get(protect, getHoldings).post(protect, addHolding);
router.route("/search/:query").get(protect, searchTicker);
router.route("/:id").put(protect, updateHolding).delete(protect, deleteHolding);
router.route("/:id/transaction").post(protect, handleTransaction);

module.exports = router;
