import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const OrderSummaryCard = ({ order, paymentStatusStyles }) => {
	const [showOrderSum, setShowOrderSum] = useState(true);

	if (!order) {
		return (
			<p className='text-center text-gray-500'>No order data available.</p>
		);
	}

	const totalItems =
		order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
	const paymentStatus = order.paymentDetails?.status || "pending";
	const { bg, text, label } = paymentStatusStyles?.[paymentStatus] || {
		bg: "bg-gray-200",
		text: "text-gray-800",
		label: paymentStatus,
	};

	const subtotal = order.subtotal
		? order.subtotal
		: order.totalAmount - order.discount;
	const discount = order.discount ?? 0;
	const totalAmount = order.totalAmount ?? subtotal - discount;

	return (
		<div className='shadow-lg bg-white p-6 rounded md:w-[50vw] max-md:w-[80vw]'>
			<div className='flex items-center justify-between'>
				<h3 className='font-Lora font-semibold'>Order Summary</h3>
				<button
					onClick={() => setShowOrderSum((s) => !s)}
					className='cursor-pointer'
				>
					{showOrderSum ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
				</button>
			</div>

			<div
				className={[
					"overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out mt-2",
					showOrderSum ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
				].join(" ")}
			>
				{/* Payment Status */}
				<div className='text-center text-xs mb-2 max-sm:text-[10px]'>
					<div className='flex space-x-1'>
						<div className={`${bg} px-2 py-1 rounded-xl`}>
							<p className={text}>{label}</p>
						</div>
						{paymentStatus === "paid" && order?.paymentDetails?.method && (
							<div className={`${bg} px-2 py-1 rounded-xl uppercase`}>
								<p className={text}>{order?.paymentDetails.method}</p>
							</div>
						)}
					</div>
				</div>

				{/* Totals */}
				<div className='space-y-1'>
					<div className='flex text-gray-700 justify-between text-sm max-sm:text-[10px] items-center'>
						<p>SubTotal</p>
						<div className='flex items-center space-x-8'>
							<p>{totalItems > 1 ? `${totalItems} Items` : "1 Item"}</p>
							<p className='tracking-wide'>
								<span className='mr-0.5'>{"\u20B9"}</span>
								{subtotal}
							</p>
						</div>
					</div>

					<div className='flex text-gray-700 text-sm max-sm:text-[10px] justify-between items-center'>
						<p>Discount</p>
						<p className='tracking-wide'>
							<span className='mr-0.5'>{"\u20B9"}</span>
							{discount}
						</p>
					</div>

					<div className='flex text-gray-700 text-md max-sm:text-sm justify-between items-center'>
						<p className='font-semibold'>Total</p>
						<p className='font-bold tracking-wide'>
							<span className='mr-0.5'>{"\u20B9"}</span>
							{totalAmount}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderSummaryCard;
