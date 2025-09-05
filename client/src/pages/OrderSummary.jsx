import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../store/orderSlice";
import { removeOrderedProducts } from "../store/cartSlice";
import { useEffect } from "react";
import ShippingAddrCard from "../components/Order/ShippingAddrCard";
import OrderItems from "../components/Order/OrderItems";
import { BiLeftArrow } from "react-icons/bi";
import Navbar from "../components/Navbar";

const OrderSummary = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { items, subtotal, discount, totalAmount, shippingAddress } =
		location.state || {};
	const { status, error } = useSelector((state) => state.order);
	useEffect(() => {
		if (!items || items.length === 0) {
			navigate("/");
		}
	}, [items, navigate]);

	const handlePlaceOrder = () => {
		const orderData = {
			selectedProducts: items,
			subtotal,
			discount,
			totalAmount,
			shippingAddress,
		};
		dispatch(placeOrder(orderData));
		const orderedProductIds = items.map((item) => item.productId);
		dispatch(removeOrderedProducts(orderedProductIds));
	};

	const handleDiscard = () => {
		navigate("/");
	};

	useEffect(() => {
		if (status === "success") {
			navigate("/");
		} else if (status === "failed") {
			alert(error || "Failed to place order");
		}
	}, [status, error, navigate]);

	return (
		<div className='p-6'>
			<Navbar />
			<div
				className='flex space-x-1 items-center mb-5'
				onClick={() => navigate("/profile")}
			>
				<BiLeftArrow />
				<h3 className='text-gray-700 cursor-pointer'>Back to Orders</h3>
			</div>
			<h1 className='font-Lora font-semibold text-2xl text-center'>Summary</h1>

			<div className='flex space-x-1 items-start max-md:flex-col max-md:items-center justify-around'>
				<div>
					<OrderItems items={items} />
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='max-md:hidden'>
						<div
							onClick={() => handlePlaceOrder()}
							className='border my-2 px-3 py-2 font-medium text-lg tracking-tigher text-center border-yellow-500 text-yellow-500 hover:cursor-pointer hover:bg-yellow-500 hover:text-white transition-discrete duration-300'
						>
							BUY NOW
						</div>
						<div
							onClick={() => handleDiscard()}
							className='border my-2 px-3 py-2 font-medium text-lg tracking-wider text-center border-gray-500 text-gray-500 hover:cursor-pointer hover:bg-gray-500 hover:text-white transition-discrete duration-300'
						>
							Discard
						</div>
					</div>
					<div className='p-6 shadow-lg bg-white max-md:mt-2 max-md:w-[80vw]'>
						<p className='font-semibold font-Lora'>Order Summary</p>
						<div className='space-y-1 p-2'>
							<div className='flex text-gray-700 justify-between text-sm items-center'>
								<p>SubTotal</p>
								<div className='flex items-center space-x-8'>
									<p>
										{items?.length > 1 ? `${items?.length} Items` : "1 Item"}
									</p>
									<p className='tracking-wide'>
										<span className='mr-0.5'>{"\u20B9"}</span>
										{subtotal}
									</p>
								</div>
							</div>

							<div className='flex text-gray-700 text-sm justify-between items-center'>
								<p>Discount</p>
								<p className='tracking-wide'>
									<span className='mr-0.5'>{"\u20B9"}</span>
									{discount}
								</p>
							</div>

							<div className='flex text-gray-700 text-md justify-between items-center'>
								<p className='font-semibold'>Total</p>
								<p className='font-bold tracking-wide'>
									<span className='mr-0.5'>{"\u20B9"}</span>
									{totalAmount}
								</p>
							</div>
						</div>
					</div>
					<ShippingAddrCard orderAddress={shippingAddress} />
					<div className='flex min-md:hidden space-x-2'>
						<div
							onClick={() => handlePlaceOrder()}
							className='border my-2 px-3 py-2 font-medium text-lg tracking-tigher text-center border-yellow-500 text-yellow-500 hover:cursor-pointer hover:bg-yellow-500 hover:text-white transition-discrete duration-300'
						>
							BUY NOW
						</div>
						<div
							onClick={() => handleDiscard()}
							className='border my-2 px-3 py-2 font-medium text-lg tracking-wider text-center border-gray-500 text-gray-500 hover:cursor-pointer hover:bg-gray-500 hover:text-white transition-discrete duration-300'
						>
							Discard
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;
