const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	rating: Number,
	comment: { type: String, required: true },
	date: Date,
	reviewerName: { type: String, required: true },
	reviewerEmail: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: String, required: true },
	price: Number,
	discountPercentage: Number,
	rating: Number,
	stock: Number,
	tags: [String],
	brand: String,
	sku: String,
	weight: Number,
	dimensions: {
		width: Number,
		height: Number,
		depth: Number,
	},
	warrantyInformation: { type: String, required: true },
	shippingInformation: { type: String, required: true },
	availabilityStatus: { type: String, required: true },
	reviews: [reviewSchema],
	returnPolicy: { type: String, required: true },
	meta: {
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
	images: [String],
	thumbnail: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
	