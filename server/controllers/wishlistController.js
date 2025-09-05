const Wishlist = require("../models/wishModel");
const Product = require("../models/productModel");

exports.getWishlist = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}
		const wishlist = await Wishlist.findOne({ user: userId }).populate(
			"products"
		);
		if (!wishlist) {
			return res.status(200).json({
				products: [],
				message: "Wishlist is empty.",
			});
		}
		return res.status(200).json({
			products: wishlist.products,
			message: "Wishlist fetched successfully.",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to fetch wishlist. Please try later.",
			errorMessage: error.message || error,
		});
	}
};

exports.addToWishlist = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}
		const prodId = req.body.prodId;

		if (!prodId) {
			return res.status(400).json({ message: "product required" });
		}

		const prod = await Product.findById(prodId);
		if (!prod) {
			return res.status(404).json({ message: "Product not found" });
		}

		let wishlist = await Wishlist.findOne({ user: userId });
		if (!wishlist) {
			wishlist = new Wishlist({ user: userId, products: [] });
		}

		if (wishlist.products.some((id) => id.equals(prod._id))) {
			return res
				.status(409)
				.json({ message: "Item already exists in wishlist." });
		}

		wishlist.products.push(prod._id);
		await wishlist.save();
		return res.status(200).json({
			message: "Product added to wishlist.",
			updatedProduct: prod,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Cannot add to wishlist. Please try later",
			errorMessage: error.message,
		});
	}
};

exports.removeFromWishlist = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to remove to wishlist" });
		}
		const productId = req.body.prodId;
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required." });
		}

		let wishlist = await Wishlist.findOne({ user: userId });
		if (!wishlist) {
			return res.status(404).json({ message: "Wishlist not found." });
		}

		const prod = await Product.findById(productId);
		if (!prod) {
			return res.status(404).json({ message: "Product not found." });
		}

		wishlist.products = wishlist.products.filter((id) => !id.equals(productId));
		await wishlist.save();

		return res.status(200).json({
			message: "Product removed from wishlist.",
			updatedProduct: prod,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Cannot remove from wishlist. Please try later",
			errorMessage: error.message || error,
		});
	}
};
