import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchCart,
	removeFromCartAsync,
	updateCartQuantityAsync,
} from "../store/cartSlice";
import { MdDone } from "react-icons/md";
import emptyCartImg from "../assets/emptyCart.svg";
import { Link, useNavigate } from "react-router-dom";
import { pickGradient } from "../utils/gradient";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import Navbar from "../components/Navbar";
import { SpinnerInfinity } from "spinners-react";
import toast from "react-hot-toast";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Cart = () => {
	const dispatch = useDispatch();
	const { cart, status } = useSelector((state) => state.cart);
	const navigate = useNavigate();
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [isOrderDetails, setIsOrderDetails] = useState(false);

	const handleSelectProduct = (productId) => {
		setSelectedProducts(
			(prev) =>
				prev.includes(productId)
					? prev.filter((id) => id !== productId) // remove if already selected
					: [...prev, productId] // add if not selected
		);
		console.log(selectedProducts);
	};

	useEffect(() => {
		if (localStorage.getItem("token")) {
			dispatch(fetchCart());
		}
	}, [dispatch]);

	const handleQuantityChange = useCallback(
		(productId, quantity) => {
			if (quantity === 0) {
				dispatch(removeFromCartAsync({ productId }));
			} else {
				dispatch(updateCartQuantityAsync({ productId, quantity }));
			}
		},
		[dispatch]
	);

	const handleRemove = async (productId) => {
		dispatch(removeFromCartAsync({ productId }));
	};

	const calculateSelectedTotal = () => {
		return cart
			.filter((item) => selectedProducts.includes(item.product._id))
			.reduce((total, item) => {
				return total + Math.round(item.product.price * 85) * item.quantity;
			}, 0);
	};

	const calculateDiscount = () => {
		let subtotal = calculateSelectedTotal();
		if (subtotal > 500 && subtotal < 2000) {
			return Math.round(subtotal * 0.1);
		} else if (subtotal > 2000) {
			return Math.round(subtotal * 0.2);
		} else {
			return 0;
		}
	};

	const calculateTotal = () => {
		return calculateSelectedTotal() - calculateDiscount();
	};

	const proceedToShipping = () => {
		// filter only the selected cart items
		if (selectedProducts.length === 0) {
			toast.error("Select atleast 1 product to continue");
			return;
		}
		const items = cart
			.filter((item) => selectedProducts.includes(item.product._id))
			.map((item) => ({
				productId: item.product._id,
				productName: item.product.title,
				productImage: item.product.thumbnail,
				priceAtPurchase: Math.trunc(item.product.price * 85), // your price conversion
				quantity: item.quantity,
			}));

		const subtotal = calculateSelectedTotal();
		const discount = calculateDiscount();
		const totalAmount = calculateTotal();

		navigate("/shipping", {
			state: { items, subtotal, discount, totalAmount },
		});
	};

	return (
		<>
			<Navbar />
			<div className='relative flex flex-col items-center p-2 w-full'>
				<h1 className='font-Lora text-4xl max-md:text-2xl mb-5'>My Cart</h1>
				<div className='flex items-center justify-center w-[90%]'>
					{status === "loading" && (
						<div className='flex items-center justify-center min-h-[60vh] w-full'>
							<SpinnerInfinity
								size={90}
								thickness={111}
								speed={100}
								color='rgba(255, 235, 59, 1)'
								secondaryColor='rgba(158, 172, 57, 0.22)'
							/>
						</div>
					)}
					{status === "success" && cart?.length > 0 && (
						<div className='flex w-full space-x-5 max-md:flex-col'>
							<div className='flex flex-col space-y-2 w-[75%]'>
								{cart.map((item) => {
									const product = item.product;
									const bgStyle = {
										background: pickGradient(
											product._id || product.title || Math.random().toString()
										),
									};
									return (
										<div
											key={product._id}
											className='flex justify-between items-center border-b pb-2 border-gray-200 mb-5'
										>
											<div className='flex space-x-2'>
												<div className='flex items-center space-x-10 max-sm:space-x-3'>
													{/* Checkbox for selecting product*/}
													<div
														onClick={() => handleSelectProduct(product._id)}
														className={`md:w-5 md:h-5 h-3 w-3 border-2 rounded cursor-pointer flex items-center justify-center transition-colors ${
															selectedProducts.includes(product._id)
																? "border-yellow-500 text-yellow-500"
																: "border-gray-400 bg-white"
														}`}
													>
														{selectedProducts.includes(product._id) && (
															<div>
																<MdDone />
															</div>
														)}
													</div>

													{/* Product Image */}
													<Link
														to={`/product/${product._id}`}
														state={{ product }}
													>
														<div
															className='aspect-[3/4] max-sm:w-[15vw] max-md:w-[10vw] max-lg:w-[5vw] lg:w-[5vw] flex items-center justify-center overflow-hidden rounded-lg'
															style={bgStyle}
														>
															<img
																src={product.thumbnail}
																alt={product.title}
																className='w-full h-full object-contain'
															/>
														</div>
													</Link>
												</div>

												<div className='flex flex-col items-start justify-between'>
													{/* Brand Name and Title of the Prod */}
													<Link
														to={`/product/${product._id}`}
														state={{ product }}
													>
														<div>
															<h4 className='text-yellow-700 text-[12px] min-sm:text-xs min-md:text-sm font-semibold tracking-tighter'>
																{product.brand || "Walmart"}
															</h4>
															<h2 className='text-[12px] min-sm:text-xs min-md:text-sm font-semibold text-gray-600 font-Lora'>
																{product.title}
															</h2>
														</div>
													</Link>

													{/* Price */}
													<div className='min-md:hidden'>
														<div className='flex space-x-1 flex-col items-start'>
															<div className='font-semibold font-Lora flex items-center space-x-1'>
																<BiSolidOffer />
																<div className='flex space-x-1 items-center'>
																	<p className='text-xs'>Savings: </p>
																	<p className='text-xs text-yellow-800'>
																		{"\u20B9"}
																		{Math.trunc(
																			(product.price +
																				(product.price *
																					product.discountPercentage) /
																					100) *
																				85
																		) *
																			item.quantity -
																			Math.trunc(product.price * 85) *
																				item.quantity}
																	</p>
																</div>
															</div>
															<div className='flex space-x-1 items-end text-xs'>
																<div className='text-yellow-800 flex items-center space-x-1'>
																	<p className='text-gray-700 font-bold tracking-wide text-lg'>
																		<span className='mr-0.5'>{"\u20B9"}</span>
																		{Math.trunc(product.price * 85) *
																			item.quantity}
																	</p>
																	<p className='line-through tracking-tighter'>
																		Rs.
																		{Math.trunc(
																			(product.price +
																				(product.price *
																					product.discountPercentage) /
																					100) *
																				85
																		)}
																	</p>
																	<h2 className='font-bold'>
																		({product.discountPercentage}%)
																	</h2>
																</div>
															</div>
														</div>
													</div>

													{/* Handling Quantity Change */}
													<div className='flex items-center space-x-2'>
														<button
															className='p-1 max-sm:text-xs border rounded-md cursor-pointer duration-200 transition-colors hover:text-red-500 text-yellow-500'
															onClick={() =>
																handleQuantityChange(
																	product._id,
																	item.quantity - 1
																)
															}
														>
															{item.quantity === 1 ? (
																<MdOutlineDelete />
															) : (
																<FaMinus />
															)}
														</button>
														<span className='max-sm:text-xs'>
															{item.quantity}
														</span>
														<button
															className='p-1 max-sm:text-xs border text-md rounded-md text-yellow-500 duration-200 transition-colors hover:text-green-400 cursor-pointer'
															onClick={() =>
																handleQuantityChange(
																	product._id,
																	item.quantity + 1
																)
															}
														>
															<FaPlus />
														</button>
														{/* Delete button */}
														<button
															className='ml-4 p-1 max-sm:text-md text-xl hover:underline text-yellow-500 transition-colors duration-300 hover:text-red-500 cursor-pointer flex items-center justify-center'
															onClick={() => handleRemove(product._id)}
														>
															<MdOutlineDelete />
														</button>
													</div>
												</div>
											</div>
											{/* Price */}
											<div className='max-md:hidden'>
												<div className='flex space-x-1 flex-col items-end'>
													<div className='font-semibold font-Lora flex items-center space-x-1'>
														<BiSolidOffer />
														<div className='flex space-x-1 items-center'>
															<p className='text-xs'>Savings: </p>
															<p className='text-sm text-yellow-800'>
																{"\u20B9"}
																{Math.trunc(
																	(product.price +
																		(product.price *
																			product.discountPercentage) /
																			100) *
																		85
																) *
																	item.quantity -
																	Math.trunc(product.price * 85) *
																		item.quantity}
															</p>
														</div>
													</div>
													<div className='flex space-x-1 items-end'>
														<div className='text-yellow-800 flex space-x-1'>
															<p className='line-through tracking-tighter'>
																Rs.
																{Math.trunc(
																	(product.price +
																		(product.price *
																			product.discountPercentage) /
																			100) *
																		85
																)}
															</p>
															<h2 className='font-bold'>
																({product.discountPercentage}%)
															</h2>
														</div>
														<p className='text-gray-700 font-bold tracking-wide text-xl'>
															<span className='mr-0.5'>{"\u20B9"}</span>
															{Math.trunc(product.price * 85) * item.quantity}
														</p>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
							{selectedProducts.length > 0 && (
								<div className='min-md:hidden fixed bottom-0 text-sm left-0 w-full bg-white p-3 z-50'>
									<div className='font-light mb-2 p-1 bg-white'>
										<div
											className='flex items-center justify-between cursor-pointer'
											onClick={() => setIsOrderDetails((p) => !p)}
										>
											<p className='font-semibold '>Order Details</p>
											{isOrderDetails ? <IoIosArrowDown /> : <IoIosArrowUp />}
										</div>

										{isOrderDetails && (
											<div>
												<div className='flex justify-between items-center'>
													<p>Bag total</p>
													<span>
														<span>{"\u20B9"}</span>
														{calculateSelectedTotal()}
													</span>
												</div>
												<div className='flex justify-between items-center'>
													<p className='font-light'>Bag discount</p>
													<span className='text-yellow-800'>
														<span>-{"\u20B9"}</span>
														{calculateDiscount()}
													</span>
												</div>
											</div>
										)}
									</div>
									<div className='flex items-center justify-between'>
										<span className='font-semibold'>
											Total: ₹{calculateTotal()}
										</span>
										<div
											onClick={proceedToShipping}
											className='disabled uppercase hover:bg-yellow-700 hover:text-white border-yellow-500 tracking-wide cursor-pointer font-bold text-yellow-500 border hover:border-none transition-colors duration-200 p-3 text-center'
										>
											proceed to shipping
										</div>
									</div>
								</div>
							)}

							<div className='m-2 h-[26vh] w-[25%] max-md:hidden'>
								<div className='p-2 bg-[#FAFAFA] border-x border-t border-yellow-200'>
									<h1 className='text-md font-Lora font-semibold'>
										Order Details
									</h1>
									<div className='p-1 font-light'>
										<div className='flex justify-between items-center'>
											<p>Bag total</p>
											<span>
												<span>{"\u20B9"}</span>
												{calculateSelectedTotal()}
											</span>
										</div>
										<div className='flex justify-between items-center'>
											<p className='font-light'>Bag discount</p>
											<span className='text-yellow-800'>
												<span>-{"\u20B9"}</span>
												{calculateDiscount()}
											</span>
										</div>
									</div>
									<div className='flex justify-between mb-2 font-semibold text-lg text-gray-800 items-center tracking-tighter'>
										<p>Order Total</p>
										<span>
											<span>{"\u20B9"}</span>
											{calculateTotal()}
										</span>
									</div>
								</div>
								<div
									onClick={proceedToShipping}
									className='disabled uppercase hover:bg-yellow-700 hover:text-white border-yellow-500 tracking-wide cursor-pointer font-bold text-yellow-500 border hover:border-none transition-colors duration-200 p-3 text-center'
								>
									proceed to shipping
								</div>
							</div>
						</div>
					)}
					{status === "success" && cart?.length === 0 && (
						<div className='mt-20 space-y-3 flex flex-col items-center justify-center'>
							<img src={emptyCartImg} alt='' className='w-70' />
							<h1 className='capitalize text-xl font-Lora font-medium text-center'>
								Try browsing our vast catalog to see
								<br /> your favourite products here!
							</h1>
							<button
								className='uppercase cursor-pointer tracking-wider font-medium border text-yellow-500 border-yellow-500 p-3'
								onClick={() => navigate("/")}
							>
								browse catalog
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Cart;
