const User = require("../models/userModel");

exports.getUser = async (req, res) => {
	try {
		const userData = await User.findById(req.user.id)
			.select("-password")
			.populate({
				path: "cart",
				options: { sort: { createdAt: -1 } },
			})
			.populate({
				path: "wishlist",
				options: { sort: { createdAt: -1 } },
			})
			.populate({
				path: "orders",
				options: { sort: { createdAt: -1 } },
			});
		console.log("From get User:", userData);

		if (!userData) return res.status(404).json({ message: "User not found" });
		res.json({ message: "User fetched successfully", user: userData });
	} catch (error) {
		return res.status(500).json({
			message: "Cannot process the request. Please try later",
			errorMessage: error.message,
		});
	}
};

exports.updateUser = async (req, res) => {
	try {
		const allowedUpdates = ["firstName", "lastName", "email", "phone", "dob"];
		const updates = {};
		for (let key of allowedUpdates) {
			if (req.body[key] !== undefined) {
				updates[key] = req.body[key];
			}
		}

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ $set: updates },
			{ new: true, runValidators: true }
		)
			.select("-password")
			.populate("cart")
			.populate("wishlist")
			.populate("orders");

		if (!user) return res.status(404).json({ message: "User not found" });

		res.json({ message: "Data updated successfully", user: user });
	} catch (error) {
		return res.status(500).json({
			message: "Cannot process the request. Please try later",
			errorMessage: error.message,
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		res.json({ message: "User deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
