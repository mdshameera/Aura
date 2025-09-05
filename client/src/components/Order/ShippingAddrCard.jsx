import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const ShippingAddrCard = ({ orderAddress }) => {
	const [showShipAddr, setShowShipAddr] = useState(true);
	return (
		<div className='shadow-lg bg-white p-6 md:w-[20vw] max-md:w-[80vw] rounded'>
			<div className='flex items-center justify-between'>
				<h3 className='font-Lora'>Shipping Address</h3>
				<button
					onClick={() => setShowShipAddr((s) => !s)}
					className='cursor-pointer'
				>
					{showShipAddr ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
				</button>
			</div>

			{/* Collapsible */}
			<div
				className={[
					"overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out",
					showShipAddr ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
				].join(" ")}
			>
				<div className='text-sm flex flex-col space-y-1 text-gray-600 py-2'>
					<div className='flex space-x-1 text-sm items-center'>
						<FaRegUser />
						<p>{orderAddress?.name}</p>
					</div>
					<p>{orderAddress?.buildingName}</p>
					<p>{orderAddress?.street}</p>
					<p>{orderAddress?.landmark}</p>
					<p>
						{orderAddress?.city}, {orderAddress?.state}
					</p>
					<p>
						{orderAddress?.country} - {orderAddress?.postalCode}
					</p>
					<p>{orderAddress?.mobile}</p>
				</div>
			</div>
		</div>
	);
};

export default ShippingAddrCard;
