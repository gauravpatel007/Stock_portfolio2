const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getWatchlist,
  addWatchlistItem,
  deleteWatchlistItem,
  updateWatchlistItem,
} = require("../controllers/watchlistController");

router.route("/")
  .get(protect, getWatchlist)
  .post(protect, addWatchlistItem);

router.route("/:id")
  .delete(protect, deleteWatchlistItem)
  .put(protect, updateWatchlistItem);

module.exports = router;
