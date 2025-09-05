const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.getCart = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}

		const cart = await Cart.findOne({ user: userId }).populate(
			"products.product"
		);
		if (!cart || cart.products.length === 0) {
			return res.status(200).json({ message: "Cart is empty", cart: [] });
		}
		return res.status(200).json({
			message: "Cart fetched successfully",
			cart: cart.products,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Cannot fetch cart at this time. Please try later.",
			errorMsg: error.message,
		});
	}
};

exports.addToCart = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}

		const prodId = req.body.productId;
		let qty = 1;

		if (!prodId) {
			return res.status(400).json({ message: "Product id is required" });
		}
		const product = await Product.findById(prodId);
		console.log(product);
		if (!product) {
			return res.status(404).json({ message: "Product not found!" });
		}

		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			cart = new Cart({
				user: userId,
				products: [{ product: product._id, quantity: qty }],
			});
			await cart.save();
			return res.status(201).json({
				message: "Cart created and product added.",
				product: cart.products,
			});
		}

		const itemIndex = cart.products.findIndex((item) =>
			item?.product?.equals(product._id)
		);

		if (itemIndex > -1) {
			return res.status(400).json({ message: "Product already in cart" });
		}

		cart.products.push({ product: product._id, quantity: qty });
		await cart.save();

		return res.status(200).json({
			message: "Product added to cart.",
			product: { product, quantity: 1 },
		});
	} catch (error) {
		return res.status(500).json({
			message: "Cannot add to cart at this time.Please try later.",
			errorMsg: error.message,
		});
	}
};

exports.removeFromCart = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}
		const prodId = req.body.productId;
		if (!prodId) {
			return res.status(400).json({ message: "Product id is required" });
		}
		const product = await Product.findById(prodId);
		if (!product) {
			return res.status(404).json({ message: "Product not found!" });
		}
		const cart = await Cart.findOne({ user: userId });
		if (!cart || cart.products.length === 0) {
			return res.status(404).json({ message: "Cart is empty" });
		}

		const itemIndex = cart.products.findIndex((item) =>
			item?.product?.equals(product._id)
		);

		if (itemIndex > -1) {
			cart.products.splice(itemIndex, 1);
			await cart.save();
			return res.status(200).json({
				message: "Product removed from cart.",
				removedProductId: prodId,
			});
		}

		return res.status(404).json({ message: "Product not found in cart." });
	} catch (error) {
		return res.status(500).json({
			message: "Cannot remove from cart at this time. Please try later.",
			errorMsg: error.message,
		});
	}
};

exports.updateQuantity = async (req, res) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res
				.status(401)
				.json({ message: "Please login to add to wishlist" });
		}

		const { productId, quantity } = req.body;
		if (!productId || quantity == null) {
			return res
				.status(400)
				.json({ message: "Product id and quantity required" });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found!" });
		}

		const cart = await Cart.findOne({ user: userId }).populate(
			"products.product"
		);
		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		const itemIndex = cart.products.findIndex((item) =>
			item.product._id.equals(product._id)
		);

		if (itemIndex === -1) {
			return res.status(404).json({ message: "Product not in cart" });
		}

		let updatedCartItem = null;
		if (quantity < 1) {
			cart.products.splice(itemIndex, 1);
		} else {
			cart.products[itemIndex].quantity = quantity;
			updatedCartItem = cart.products[itemIndex];
		}

		await cart.save();

		return res.status(200).json({
			message: "Cart updated.",
			product: updatedCartItem,
			removedProductId: quantity < 1 ? productId : null,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Cannot update quantity at this time.",
			errorMsg: error.message,
		});
	}
};
