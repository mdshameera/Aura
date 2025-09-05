import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SpinnerInfinity } from "spinners-react";
import CustomDropdown from "../../utils/customDropdown";
import { pickGradient } from "../../utils/gradient";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
	const { user, loading } = useSelector((state) => state.user);
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let y = currentYear; y >= 2022; y--) {
		years.push(y);
	}

	const filterOrders = (orders, selectedPeriod) => {
		if (!orders) return [];

		if (selectedPeriod === "Last 6 Months") {
			const sixMonthsAgo = new Date();
			sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
			return orders.filter(
				(order) => new Date(order.createdAt) >= sixMonthsAgo
			);
		}

		if (!isNaN(selectedPeriod)) {
			return orders.filter(
				(order) =>
					new Date(order.createdAt).getFullYear() === parseInt(selectedPeriod)
			);
		}

		return orders;
	};

	const periods = ["Last 6 Months", ...years.map((y) => String(y))];
	// State to track selected period
	const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
	const navigate = useNavigate();
	return (
		<div>
			<h3 className='text-4xl mb-2 max-md:text-xl text-center text-gray-800 font-Lora'>
				My Orders
			</h3>
			{loading === true && (
				<SpinnerInfinity
					size={90}
					thickness={111}
					speed={100}
					color='rgba(255, 235, 59, 1)'
					secondaryColor='rgba(158, 172, 57, 0.22)'
				/>
			)}
			{user && (
				<div>
					<CustomDropdown
						label='Orders period'
						options={periods}
						value={selectedPeriod}
						onChange={setSelectedPeriod}
					/>
					<div className='flex items-center justify-center flex-col space-y-1'>
						{filterOrders(user.orders, selectedPeriod).length > 0 ? (
							filterOrders(user.orders, selectedPeriod).map((order, indx) => {
								const firstItem = order.items[0];
								const bgStyle = {
									background: pickGradient(
										firstItem.product ||
											firstItem.productName ||
											Math.random().toString()
									),
								};
								const createdAt = new Date(order.createdAt);
								const deliveryDate = new Date(createdAt);
								deliveryDate.setDate(createdAt.getDate() + 3);
								return (
									<div
										key={indx}
										onClick={() => navigate(`/orders/${order?._id}`)}
										className='border-b border-gray-200 p-2 w-full flex cursor-pointer space-x-1 items-center justify-between'
									>
										<div className='flex space-x-1'>
											<div
												className='w-[9vh] h-[12vh] relative flex items-center justify-center overflow-hidden rounded-lg'
												style={bgStyle}
											>
												<img
													src={firstItem.productImage}
													className='w-full h-full object-contain'
												/>
											</div>
											<div className='flex flex-col justify-around'>
												<div className='flex space-x-2 max-md:flex-col max-md:items-start items-center'>
													<div className='font-semibold text-gray-900 tracking-tight'>
														<p className='text-sm max-md:text-xs'>Delivery by</p>
														<p className='text-green-700 max-md:text-xs'>
															{deliveryDate.toLocaleDateString("en-US", {
																day: "2-digit",
																month: "long",
																year: "numeric",
															})}
														</p>
													</div>
													{order?.deliveryStatus === "cancelled" && (
														<div className='bg-red-200 px-1.5 py-0.5 text-red-700 rounded-xl text-center text-xs max-md:text-[10px]'>
															Cancelled
														</div>
													)}
												</div>

												<h5 className='text-xs max-md:text-[10px] font-semibold text-gray-400'>
													{order?.orderNumber}
												</h5>
											</div>
										</div>
										<div className='flex items-center space-x-2'>
											<div className='flex flex-col items-end justify-between'>
												<p className='text-gray-700 font-bold tracking-wide text-md font-Lora max-md:text-sm'>
													<span className='mr-0.5'>{"\u20B9"}</span>
													{order.totalAmount}
												</p>
												<p className='text-xs max-md:hidden font-semibold text-gray-700'>
													Ordered on{" "}
													{createdAt.toLocaleDateString("en-US", {
														day: "2-digit",
														month: "long",
														year: "numeric",
													})}
												</p>
											</div>
											<div className='cursor-pointer text-gray-700'>
												<FaChevronRight />
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div>
								<p className='font-semibold mt-20'>
									No Orders placed in this period
								</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Orders;
