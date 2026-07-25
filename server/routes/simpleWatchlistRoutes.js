const express = require("express");
const router = express.Router();
const {
  getSimpleWatchlist,
  addSimpleWatchlist,
  deleteSimpleWatchlist,
} = require("../controllers/simpleWatchlistController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getSimpleWatchlist).post(protect, addSimpleWatchlist);
router.route("/:id").delete(protect, deleteSimpleWatchlist);

module.exports = router;
