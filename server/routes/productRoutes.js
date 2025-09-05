const express = require("express");
const router = express.Router();

const {
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	addProduct,
} = require("../controllers/productController");

router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.post("/product", addProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
