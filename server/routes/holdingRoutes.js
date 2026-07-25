const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getHoldings,
  addHolding,
  updateHolding,
  deleteHolding,
  searchTicker,
} = require("../controllers/holdingController");

router.route("/").get(protect, getHoldings).post(protect, addHolding);
router.route("/search/:query").get(protect, searchTicker);
router.route("/:id").put(protect, updateHolding).delete(protect, deleteHolding);

module.exports = router;
