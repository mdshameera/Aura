const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const protect = require("./middleware/authMiddleware");
const addressRoutes = require("./routes/addressRoutes");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api", productRoutes);
app.use("/api/wishlist", protect, wishlistRoutes);
app.use("/api/cart", protect, cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", protect, userRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/address", protect, addressRoutes);

const port = process.env.PORT || 4000;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDb is connected"))
	.catch((err) => console.log(`Failed to connect: ${err}`));

app.listen(port, () => console.log(`Backend Started on : ${port}`));
