const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	name: { type: String, required: true },
	mobile: { type: String, required: true },
	buildingName: { type: String, required: true },
	street: { type: String, required: true },
	landmark: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	postalCode: { type: String, required: true },
	addressType: {
		type: String,
		enum: ["Home", "Work", "Others"],
		default: "Home",
	},
	country: { type: String, default: "India" },
	isDefault: { type: Boolean, default: false },
});

module.exports = { addressSchema };
