const mongoose = require("mongoose");
const { addressSchema } = require("./addressModel");

const orderItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: { type: Number, required: true, min: 1 },
	priceAtPurchase: { type: Number, required: true },
	productName: String,
	productImage: String,
});

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: {
			type: [orderItemSchema],
			required: true,
		},
		subtotal: { type: Number, required: true },
		totalAmount: { type: Number, required: true },
		discount: { type: Number, default: 0 },

		shippingAddress: { type: addressSchema, required: true },

		deliveryStatus: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
				"returned",
			],
			default: "pending",
		},

		paymentDetails: {
			method: {
				type: String,
				enum: ["cod", "card", "upi", "netbanking"],
				default: "cod",
			},
			status: {
				type: String,
				enum: ["pending", "paid", "failed", "refunded"],
				default: "pending",
			},
			transactionId: String,
			paymentDate: Date,
		},
		orderNumber: { type: String, unique: true },
		placedAt: { type: Date, default: Date.now },
		deliveredAt: { type: Date },
		cancelledAt: { type: Date },
		refundAmount: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

orderSchema.pre("save", async function (next) {
	if (!this.orderNumber) {
		this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
	}
	next();
});

module.exports = mongoose.model("Order", orderSchema);
