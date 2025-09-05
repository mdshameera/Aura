const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
	const {
		title,
		description,
		category,
		price,
		discountPercentage,
		rating,
		stock,
		tags,
		brand,
		sku,
		weight,
		dimensions,
		warrantyInformation,
		shippingInformation,
		availabilityStatus,
		reviews,
		returnPolicy,
		images,
		thumbnail,
	} = req.body;
	try {
		const newProduct = new Product({
			title,
			description,
			category,
			price,
			discountPercentage,
			rating,
			stock,
			tags,
			brand,
			sku,
			weight,
			dimensions,
			warrantyInformation,
			shippingInformation,
			availabilityStatus,
			reviews,
			returnPolicy,
			images,
			thumbnail,
			createdAt: Date,
		});

		await newProduct.save();
		return res.status(200).json({ message: "Product added successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Internal server error. Please Try later",
			errorMessage: error,
		});
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;

		const currentProduct = await Product.findOne(productId);
		if (!currentProduct) {
			return res.status(404).json({
				message:
					"Product not found or you are not authorized to do this action.",
			});
		}

		await Product.findByIdAndUpdate(productId, req.body, { new: true });
		return res
			.status(200)
			.json({ message: "Product updated successfully", currentProduct });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Failed to update product. Try later." });
	}
};

exports.deleteProduct = async (req, res) => {
	const productId = req.params.id;
	try {
		const deleteProduct = await Product.findOne(productId);
		if (!deleteProduct) {
			return res.status(404).json({
				message:
					"Product not found or you are not authorized to do this action.",
			});
		}

		await Product.findByIdAndDelete(productId);
		return res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Failed to delete the product. Please try later",
			errorMessage: error,
		});
	}
};

exports.getAllProducts = async (req, res) => {
	try {
		let { limit = 30, skip = 0, category, minPrice, maxPrice } = req.query;
		limit = Number(limit);
		skip = Number(skip);
		let query = {};

		if (category) {
			const categories = category.split(",");
			query.category = { $in: categories };
		}

		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice) / 85;
			if (maxPrice) query.price.$lte = Number(maxPrice) / 85;
		}

		let productsQuery = Product.find(query);

		if (limit !== 0) {
			productsQuery = productsQuery.skip(skip).limit(limit);
		}

		const allProducts = await productsQuery;

		return res
			.status(200)
			.json({ allProducts, message: "Products fetched successfully" });
	} catch (error) {
		return res.status(500).json({
			message: "Failed to retrieve. Please try later",
			errorMessage: error,
		});
	}
};

exports.getSingleProduct = async (req, res) => {
	try {
		const singleProduct = await Product.findById(req.params.id);
		return res
			.status(200)
			.json({ message: "product fetched successfully", singleProduct });
	} catch (error) {
		return res.status(500).json({
			message: "Failed to get the product. Please try again later",
			errorMessage: error,
		});
	}
};
