const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishSchema);
