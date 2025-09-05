const express = require("express");
const router = express.Router();

const {
	addToWishlist,
	removeFromWishlist,
	getWishlist,
} = require("../controllers/wishlistController");

router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.get("/", getWishlist);

module.exports = router;
