const User = require("../models/userModel");

exports.addAddress = async (req, res) => {
	try {
		const user = await User.findById(req.user.id); // ✅ already attached by middleware
		if (!user) return res.status(404).json({ message: "User not found" });

		if (req.body.isDefault) {
			user.addresses.forEach((addr) => (addr.isDefault = false));
		}

		user.addresses.push(req.body);
		await user.save();

		return res.json({
			message: "Address added successfully",
			addresses: user.addresses,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to add address", error: error.message });
	}
};
exports.updateAddress = async (req, res) => {
	try {
		const user = await User.findById(req.user.id); // ✅ no need to refetch
		console.log("user from updateAddress: ", user);
		if (!user) return res.status(404).json({ message: "User not found" });

		const address = user.addresses.id(req.params.addressId);
		if (!address) return res.status(404).json({ message: "Address not found" });

		if (req.body?.isDefault) {
			user.addresses.forEach((addr) => (addr.isDefault = false));
		}

		Object.assign(address, req.body);
		await user.save();

		return res.json({
			message: "Address updated successfully",
			addresses: user.addresses,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to update address", error: error.message });
	}
};

exports.deleteAddress = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		const address = user.addresses.id(req.params.addressId);
		if (!address) return res.status(404).json({ message: "Address not found" });

		user.addresses.pull({ _id: req.params.addressId });
		await user.save();

		return res.json({
			message: "Address deleted successfully",
			addresses: user.addresses,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to delete address", error: error.message });
	}
};

exports.setDefaultAddress = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.addresses.forEach((addr) => (addr.isDefault = false));

		const address = user.addresses.id(req.params.addressId);
		if (!address) return res.status(404).json({ message: "Address not found" });

		address.isDefault = true;
		await user.save();

		return res.json({
			message: "Default address updated",
			addresses: user.addresses,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to set default address", error: error.message });
	}
};
