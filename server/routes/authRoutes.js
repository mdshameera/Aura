const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();
const { body } = require("express-validator");

router.post(
	"/signup",
	[
		body("firstName").notEmpty().withMessage("First name is required"),
		body("email").isEmail().withMessage("Please provide a valid email"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters")
			.matches(/\d/)
			.withMessage("Password must contain a number")
			.matches(/[!@#$%^&*]/)
			.withMessage("Password must contain a special character"),
	],
	signup
);
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Please provide a valid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	login
);

module.exports = router;
