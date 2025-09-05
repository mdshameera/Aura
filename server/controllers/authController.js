const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.signup = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { firstName, lastName, password, email } = req.body;

		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "User already exists" });

		user = await User.create({ firstName, lastName, email, password });
		
		res.status(201).json({
			message: "User created successfully",
			token: generateToken(user._id),
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
		});
	} catch (error) {
		return res.status(500).json({
			errorMesssage: "Can't signup now, Please try later",
			error: error.message,
		});
	}
};

exports.login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const isMatch = await user.comparePassword(password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" });

		res.json({
			message: "Login successful",
			token: generateToken(user._id),
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
		});
	} catch (error) {
		return res.status(500).json({
			errorMesssage: "Can't log you in now, Please try later",
			error: err.message,
		});
	}
};
