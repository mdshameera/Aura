import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/profileSlice";
import { fetchProducts, fetchSingleProduct } from "../store/productSlice";
import { BiLeftArrow } from "react-icons/bi";
import OrderItems from "../components/Order/OrderItems";
import OrderSummaryCard from "../components/Order/OrderSummaryCard";
import ShippingAddrCard from "../components/Order/ShippingAddrCard";
import { paymentStatusStyles, statusStyles } from "../utils/utils";
import { cancelOrder } from "../store/orderSlice";

const OrderDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state?.user);
	const navigate = useNavigate();
	const { products } = useSelector((state) => state.products);

	useEffect(() => {
		if (!products || products.length === 0) {
			dispatch(fetchProducts());
		}
	}, [dispatch, products]);

	useEffect(() => {
		if (!user) {
			dispatch(fetchUser());
		}
	}, [dispatch, id, user]);

	const selectedOrder = user.orders.find((x) => x._id === id);

	useEffect(() => {
		if (selectedOrder) {
			selectedOrder.items.forEach((item) => {
				const productInStore = products.find((p) => p._id === item.product);
				if (!productInStore && item.product) {
					dispatch(fetchSingleProduct({ id: item.product }));
				}
			});
		}
	}, [selectedOrder, products, dispatch]);

	if (!user || !user.orders) {
		return (
			<div>
				<Navbar />
				<SpinnerInfinity
					size={90}
					thickness={111}
					speed={100}
					color='rgba(255, 235, 59, 1)'
					secondaryColor='rgba(158, 172, 57, 0.22)'
				/>
			</div>
		);
	}

	if (!selectedOrder) {
		return (
			<div>
				<Navbar />
				<p className='text-center mt-10'>Order not found.</p>
			</div>
		);
	}

	const handleCancel = () => {
		if (
			["pending", "processing", "shipped"].includes(
				selectedOrder.deliveryStatus
			)
		) {
			dispatch(cancelOrder(selectedOrder._id));
		}
	};
	return (
		<div>
			<Navbar />
			<div>
				<div
					className='flex m-2 space-x-1 items-center'
					onClick={() => navigate("/profile")}
				>
					<BiLeftArrow />
					<h3 className='text-gray-700 cursor-pointer max-md:text-sm'>
						Back to Orders
					</h3>
				</div>
				<div className='text-center'>
					<h1 className='font-Lora text-3xl max-md:text-xl text-center mb-5'>
						Order Details
					</h1>
				</div>
				<div className='flex items-start max-md:flex-col max-md:items-center max-md:space-y-2 justify-around'>
					<div className='flex flex-col space-y-2'>
						<div className='p-2'>
							<div className='flex items-center space-x-1.5'>
								<h2 className='md:text-lg  font-semibold text-gray-800'>
									Order ID: {selectedOrder.orderNumber}
								</h2>
								<div className='text-center text-xs'>
									{(() => {
										const status = selectedOrder.deliveryStatus || "pending";
										const { bg, text, label } = statusStyles[status];
										return (
											<div className={`${bg} px-2 py-1 rounded-xl`}>
												<p className={text}>{label}</p>
											</div>
										);
									})()}
								</div>
							</div>

							<p className='md:text-sm max-md:text-xs font-semibold text-gray-500'>
								{(() => {
									const d = new Date(selectedOrder.createdAt);
									const date = d.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									});
									const time = d.toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "2-digit",
										hour12: true,
									});
									return `${date} at ${time}`;
								})()}
							</p>
							{selectedOrder.deliveryStatus !== "cancelled" && (
								<button
									onClick={handleCancel}
									disabled={
										!["pending", "processing", "shipped"].includes(
											selectedOrder.deliveryStatus
										)
									}
									className='px-3 py-1 text-xs min-md:hidden cursor-pointer bg-red-200 text-red-500 hover:bg-red-300 transition-colors duration-150 rounded'
								>
									Cancel Order
								</button>
							)}
						</div>
						{/*  Order Items */}
						<OrderItems items={selectedOrder.items} />
						{/* Order Summary */}

						<OrderSummaryCard
							order={selectedOrder}
							paymentStatusStyles={paymentStatusStyles}
						/>
					</div>
					<div>
						{selectedOrder.deliveryStatus !== "cancelled" && (
							<button
								onClick={handleCancel}
								disabled={
									!["pending", "processing", "shipped"].includes(
										selectedOrder.deliveryStatus
									)
								}
								className='px-3 py-1 max-md:hidden cursor-pointer bg-red-200 text-red-500 hover:bg-red-300 transition-colors duration-150 rounded'
							>
								Cancel Order
							</button>
						)}

						<ShippingAddrCard orderAddress={selectedOrder.shippingAddress} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
