const express = require("express");
const { createOrder, cancelOrder } = require("../controllers/orderController");
const router = express.Router();

router.post("/create", createOrder);
router.post("/:id/cancel", cancelOrder);

module.exports = router;
