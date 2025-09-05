import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { BsHandbag } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { pickGradient } from "../utils/gradient";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, removeFromCartAsync } from "../store/cartSlice";
import Navbar from "../components/Navbar";
import { fetchSingleProduct } from "../store/productSlice";
import { SpinnerInfinity } from "spinners-react";

function ProductDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const location = useLocation();
	let { product } = location.state || {};
	const { singleProduct } = useSelector((state) => state.products);
	const bgStyle = {
		background: pickGradient(
			product?._id || product?.title || Math.random().toString()
		),
	};

	const navigate = useNavigate();

	// If product not passed via location, fall back to redux state
	useEffect(() => {
		if (!product) {
			dispatch(fetchSingleProduct({ id }));
		}
	}, [dispatch, id, product]);

	// Always prefer redux singleProduct if available
	if (!product) product = singleProduct;

	const { cart } = useSelector((state) => state.cart);
	console.log("cart", cart);
	// Hooks must be called unconditionally
	const imagesArray = React.useMemo(() => {
		if (!product) return [];
		return Array.isArray(product.images) ? product.images : [product.images];
	}, [product]);

	const isInCart = cart.some((item) => item.product?._id === id);

	const handleAddtoBag = (id) => {
		if (isInCart) {
			dispatch(removeFromCartAsync({ productId: id }));
		} else {
			dispatch(addToCartAsync({ productId: id }));
		}
	};

	const [mainImage, setMainImage] = useState(imagesArray[0]);

	useEffect(() => {
		if (imagesArray.length > 0) setMainImage(imagesArray[0]);
	}, [imagesArray]);

	if (!product)
		return (
			<SpinnerInfinity
				size={90}
				thickness={111}
				speed={100}
				color='rgba(255, 235, 59, 1)'
				secondaryColor='rgba(158, 172, 57, 0.22)'
			/>
		);
	const calculateDiscount = (subtotal) => {
		if (subtotal > 500 && subtotal < 2000) {
			return Math.round(subtotal * 0.1);
		} else if (subtotal > 2000) {
			return Math.round(subtotal * 0.2);
		} else {
			return 0;
		}
	};

	const proceedToShipping = () => {
		const items = [
			{
				productId: product._id,
				productName: product.title,
				productImage: product.thumbnail,
				priceAtPurchase: Math.trunc(product.price * 85), // your price conversion
				quantity: 1,
			},
		];

		const subtotal = Math.trunc(product.price * 85);
		const discount = calculateDiscount(subtotal);
		const totalAmount = subtotal - discount;

		navigate("/shipping", {
			state: { items, subtotal, discount, totalAmount },
		});
	};

	return (
		<>
			<Navbar />
			<div className='min-h-screen w-full flex items-center mt-10 justify-center'>
				<div className='flex flex-col md:items-center justify-center'>
					<div className='flex items-start max-md:items-center max-md:flex-col justify-center gap-10'>
						<div className='flex items-center'>
							{imagesArray.length > 1 ? (
								<div className='flex max-md:flex-col-reverse gap-10 mt-2 items-center'>
									<div className='max-md:flex max-md:space-x-2'>
										{imagesArray.map((img, idx) => (
											<img
												key={idx}
												src={img}
												alt={`thumb-${idx}`}
												className={`w-16 h-16 object-contain bg-gray-300 md:my-2 cursor-pointer ${
													mainImage === img ? "ring-2 ring-yellow-500" : ""
												}`}
												style={{
													background: pickGradient(img),
												}}
												onClick={() => setMainImage(img)}
											/>
										))}
									</div>
									<img
										src={mainImage}
										className='aspect-[3/4] md:w-[25vw] max-md:w-[90vw] max-md:h-[50vh] object-contain rounded-lg'
										style={bgStyle}
										alt={product.title}
									/>
								</div>
							) : (
								<img
									src={mainImage}
									className='aspect-[3/4] md:w-[25vw] max-md:w-[90vw] max-md:h-[50vh] object-contain rounded-lg'
									style={bgStyle}
									alt={product.title}
								/>
							)}
						</div>
						<div className='flex flex-col items-center max-md:px-5 md:w-100 lg:w-100 space-y-2'>
							{/* ...existing code for product details... */}
							<div className='flex items-center flex-col space-y-2 mb-5'>
								<h4 className='text-yellow-700 font-semibold text-xl tracking-wide uppercase'>
									{product.brand || "Walmart"}
								</h4>
								<h2 className='text-xl font-semibold text-gray-600 font-Lora'>
									{product.title}
								</h2>
								<div className='flex gap-1 items-center'>
									<span
										className={`px-1 py-0.5 rounded-md ${
											product.rating < 3 ? "bg-red-700" : "bg-green-500"
										} w-[8vh] h-[4vh] text-white text-sm gap-1 items-center justify-center flex`}
									>
										{product.rating}
										<span className='text-sm'>{"\u2605"}</span>
									</span>
									<span className='text-2xs text-gray-600 font-medium'>
										{product.reviews ? product.reviews.length : 0} Ratings
									</span>
								</div>
								<h3 className='text-gray-700 text-2xl tracking-wide'>
									<span>{"\u20B9"}</span>
									{Math.trunc(product.price * 85)}
								</h3>
								<div className='tracking-tighter flex space-x-1 text-yellow-700'>
									<h2>MRP</h2>
									<h3 className=' line-through '>
										<span className=''>{"\u20B9"}</span>
										{Math.trunc(
											(product.price +
												(product.price * product.discountPercentage) / 100) *
												85
										)}
									</h3>
									<h2 className='font-bold'>
										({product.discountPercentage}% OFF)
									</h2>
								</div>
							</div>
							<div className='w-full text-center space-y-3'>
								<div
									onClick={() => handleAddtoBag(product._id)}
									className='px-5 py-2 bg-yellow-500 font-medium transition-all duration-300 hover:text-white hover:scale-105 uppercase cursor-pointer flex items-center justify-center space-x-2'
								>
									<BsHandbag />
									<p>{isInCart ? "Remove from bag" : "Add to bag"}</p>
								</div>
								<div
									onClick={() => proceedToShipping()}
									className='border my-2 px-3 py-2 font-medium text-lg tracking-wider  border-yellow-500 text-yellow-500 hover:cursor-pointer hover:bg-yellow-500 hover:text-white transition-discrete duration-300'
								>
									BUY NOW
								</div>
							</div>

							<div>
								<h6 className='font-bold tracking-wide text-gray-700'>
									Description
								</h6>
								<p className='text-gray-700 font-medium'>
									{product.description}
								</p>
								<h6 className='font-bold text-gray-700 tracking-wide my-2'>
									Product Details
								</h6>
								<div className='grid grid-cols-2 gap-2'>
									<div className='border-b border-gray-400 py-1'>
										<p className='font-medium text-gray-900'>Dimensions</p>
										<p className='text-gray-600 font-semibold'>
											{product.dimensions.height} x {product.dimensions.width} x{" "}
											{product.dimensions.depth}
										</p>
									</div>
									<div className='border-b border-gray-400 py-1'>
										<p className='font-medium text-gray-900'>
											Warranty Information
										</p>
										<p className='text-gray-600 font-semibold'>
											{product.warrantyInformation}
										</p>
									</div>

									<div className='border-b border-gray-400 py-1'>
										<p className='font-medium text-gray-900'>
											Shipping Details
										</p>
										<p className='text-gray-600 font-semibold'>
											{product.shippingInformation}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='my-10 max-md:px-5'>
						<h4 className='font-bold tracking-wider capitalize text-gray-700'>
							Hear from our buyers
						</h4>
						<div className='md:w-300 lg:w-300'>
							{product.reviews.map((review) => (
								<div key={review._id}>
									<div className='w-[50%] my-2 border-b border-gray-200'>
										<div className='font-medium p-2 flex items-center justify-between'>
											<div className='flex space-x-1 items-center'>
												<div className='w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl bg-gray-600'>
													<IoPersonOutline />
												</div>
												<div className='text-sm tracking-tight'>
													<p>{review.reviewerName}</p>
													<p>
														{new Date(review.date).toLocaleDateString(
															undefined,
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															}
														)}
													</p>
												</div>
											</div>
											<p
												className={`flex items-center ${
													review.rating < 3 ? "text-red-700" : "text-green-500"
												}`}
											>
												{Array.from({ length: review.rating }).map((_, i) => (
													<span key={i} className='text-md'>
														{"\u2605"}
													</span>
												))}
											</p>
										</div>
										<div className='p-2 flex font-medium justify-between text-sm text-gray-800'>
											<p>{review.comment}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProductDetails;
