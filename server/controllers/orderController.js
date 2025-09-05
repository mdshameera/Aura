const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

exports.createOrder = async (req, res) => {
	try {
		const userId = req.user?.id;
		const {
			shippingAddress,
			selectedProducts,
			subtotal,
			discount,
			totalAmount,
		} = req.body;

		if (!selectedProducts || selectedProducts.length === 0) {
			return res
				.status(400)
				.json({ message: "No products selected for purchase" });
		}

		const orderItems = [];

		for (const sel of selectedProducts) {
			const product = await Product.findById(sel.productId);
			if (!product) continue;

			orderItems.push({
				productId: product._id,
				quantity: sel.quantity || 1,
				priceAtPurchase: Math.trunc(product.price * 85), // 💰 snapshot in INR
				productName: product.title,
				productImage: product.thumbnail,
			});
		}

		if (orderItems.length === 0) {
			return res
				.status(400)
				.json({ message: "No valid products found for order" });
		}

		// ✅ Trust frontend calculations if provided, fallback otherwise
		const calculatedSubtotal =
			subtotal ??
			orderItems.reduce(
				(acc, item) => acc + item.priceAtPurchase * item.quantity,
				0
			);

		const calculatedDiscount = discount ?? 0;
		const calculatedTotal =
			totalAmount ?? calculatedSubtotal - calculatedDiscount;

		// create order
		const order = await Order.create({
			user: userId,
			items: orderItems,
			subtotal: calculatedSubtotal,
			discount: calculatedDiscount,
			totalAmount: calculatedTotal,
			status: "pending",
			shippingAddress,
		});

		// ✅ remove purchased items from cart if they exist
		const cart = await Cart.findOne({ user: userId });
		if (cart) {
			cart.products = cart.products.filter(
				(p) =>
					!selectedProducts.some(
						(sel) => sel.productId === p.product.toString()
					)
			);
			await cart.save();
		}

		// push order reference into user
		await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

		res.status(201).json({ message: "Order placed successfully", order });
	} catch (error) {
		res.status(500).json({ message: error.message, error });
	}
};

exports.cancelOrder = async (req, res) => {
	try {
		const userId = req.user?.id;
		const orderId = req.params.id;

		const order = await Order.findOne({ _id: orderId, user: userId });
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const cancellableStatuses = ["pending", "processing", "shipped"];
		if (!cancellableStatuses.includes(order.deliveryStatus)) {
			return res.status(400).json({
				message: `Cannot cancel an order with status '${order.deliveryStatus}'`,
			});
		}

		order.deliveryStatus = "cancelled";
		await order.save();

		return res.status(200).json({
			message: "Order cancelled successfully",
			_id: order._id,
			status: order.deliveryStatus,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to cancel order",
			error: error.message,
		});
	}
};
