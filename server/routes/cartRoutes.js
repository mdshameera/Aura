const express = require("express");
const {
	getCart,
	addToCart,
	removeFromCart,
	updateQuantity,
} = require("../controllers/cartController");
const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateQuantity);

module.exports = router;
