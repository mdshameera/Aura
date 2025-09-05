const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("./orderModel");
require("./cartModel");
require("./wishModel");
const { addressSchema } = require("./addressModel");

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "FirstName is required"],
			minlength: [3, "Name must be at least 3 characters long"],
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		phone: {
			type: String,
		},
		dob: {
			type: Date,
		},
		addresses: [addressSchema],
		wishlist: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Wishlist",
		},

		cart: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cart",
		},
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
