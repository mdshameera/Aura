import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AddressModify from "./profile/AddressModify";
import { clearError } from "../store/profileSlice";
import { SpinnerInfinity } from "spinners-react";

const ShippingPage = ({ onContinue }) => {
	const { user, loading, error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	// cart data passed from Cart.jsx
	const { items, subtotal, discount, totalAmount } = location.state || {};

	useEffect(() => {
		// Clear any leftover error when entering the page
		dispatch(clearError());
	}, [dispatch]);

	useEffect(() => {
		if (!items || items.length === 0) {
			navigate("/"); // or "/private" if that’s the intended page
		}
	}, [items, navigate]);

	const [selectedAddress, setSelectedAddress] = useState(
		user?.addresses?.find((addr) => addr.isDefault) || null
	);

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				navigate("/");
			}, 2000);
			return () => clearTimeout(timer); // cleanup
		}
	}, [error, navigate]);

	if (loading)
		return (
			<div className='flex items-center justify-center min-h-[60vh] w-full'>
				<SpinnerInfinity
					size={90}
					thickness={111}
					speed={100}
					color='rgba(255, 235, 59, 1)'
					secondaryColor='rgba(158, 172, 57, 0.22)'
				/>
			</div>
		);
	if (error)
		return (
			<p className='text-red-500 text-center'>
				{error} <br /> Redirecting to home...
			</p>
		);

	const handleContinue = (address) => {
		// push everything forward to OrderSummary
		navigate("/order/summary", {
			state: {
				items,
				subtotal,
				discount,
				totalAmount,
				shippingAddress: address,
			},
		});
	};

	return (
		<div>
			<Navbar />
			<div className='max-w-3xl mx-auto p-6'>
				<h2 className='text-2xl font-bold mb-6'>Select Shipping Address</h2>

				{/* Address List */}
				<div className='space-y-4'>
					{user?.addresses?.length > 0 ? (
						user?.addresses?.map((address, idx) => (
							<div
								key={idx}
								onClick={() => setSelectedAddress(address)}
								className={`cursor-pointer border p-4 shadow-sm transition 
                ${
									selectedAddress?._id === address._id
										? "border-yellow-500 bg-yellow-50"
										: "border-gray-300 hover:border-yellow-400"
								}`}
							>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-semibold'>{address.name}</p>
										<p className='text-sm text-gray-600'>{address.mobile}</p>
										<p className='text-sm text-gray-700'>
											{address.street}, {address.city}, {address.state} -{" "}
											{address.postalCode}
										</p>
										<p className='text-sm text-gray-500'>{address.country}</p>
									</div>
									{address.isDefault && (
										<span className='text-xs text-green-600 font-medium border border-green-600 px-2 py-1 rounded'>
											Default
										</span>
									)}
								</div>
							</div>
						))
					) : (
						<p className='text-gray-500'>No saved addresses. Please add one.</p>
					)}
				</div>

				{/* Action Buttons */}
				<div className='mt-8 flex justify-end gap-4'>
					<button
						className='px-5 py-2 border border-gray-400 hover:bg-gray-100 cursor-pointer'
						onClick={() => setIsOpen((s) => !s)}
					>
						+ Add New Address
					</button>
					<button
						className='px-6 py-2 bg-yellow-500 text-white cursor-pointer hover:bg-yellow-600 disabled:opacity-50'
						disabled={!selectedAddress}
						onClick={() => handleContinue(selectedAddress)}
					>
						Continue
					</button>
				</div>
			</div>
			{isOpen && (
				<AddressModify
					type='new'
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					user={user}
					editData={null}
				/>
			)}
		</div>
	);
};

export default ShippingPage;
