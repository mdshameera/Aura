const express = require("express");
const router = express.Router();
const {
	addAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} = require("../controllers/addressController");

router.post("/", addAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.put("/:addressId/default", setDefaultAddress);

module.exports = router;
