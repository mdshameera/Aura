import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress, updateAddress } from "../../store/profileSlice";

const AddressModify = ({ type, editData, isOpen, onClose, user }) => {
	const [formData, setFormData] = useState({
		name: "",
		mobile: "",
		buildingName: "",
		street: "",
		landmark: "",
		city: "",
		state: "",
		postalCode: "",
		addressType: "Home",
		country: "India",
		isDefault: false,
	});
	const dispatch = useDispatch();
	useEffect(() => {
		if (type === "new") {
			const firstName =
				localStorage.getItem("user.firstName") || user?.firstName || "";
			setFormData((prev) => ({ ...prev, name: firstName }));
		} else if (type === "edit" && editData) {
			setFormData(editData);
		}
	}, [type, editData, user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (type === "edit") {
			dispatch(updateAddress({ formData, addressId: editData?._id }));
		} else {
			dispatch(addAddress(formData));
		}
		setFormData({
			name: "",
			mobile: "",
			buildingName: "",
			street: "",
			landmark: "",
			city: "",
			state: "",
			postalCode: "",
			addressType: "Home",
			country: "India",
			isDefault: false,
		});
		onClose();
	};

	return (
		<div
			className={`fixed top-0 right-0 h-full min-md:w-[30vw] w-full bg-white shadow-xl z-50 flex flex-col justify-between transform transition-transform duration-300 ${
				isOpen ? "translate-x-0" : "translate-x-full"
			}`}
		>
			<div>
				<div className='flex justify-between items-center mx-6 my-3'>
					<h2 className='font-Lora text-xl'>
						{type === "new" ? "Add new address" : "Edit address"}
					</h2>
					<button
						onClick={onClose}
						className='text-gray-600 hover:text-black cursor-pointer'
					>
						✕
					</button>
				</div>

				<div className='px-6 space-y-2 mx-2 overflow-y-auto'>
					{/* Name */}
					<div className='relative'>
						<input
							type='text'
							id='name'
							name='name'
							required
							value={formData.name}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='name'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Name*
						</label>
					</div>

					{/* Mobile */}
					<div className='relative'>
						<input
							type='tel'
							id='mobile'
							name='mobile'
							required
							placeholder=' '
							value={formData.mobile}
							onChange={handleChange}
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='mobile'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Mobile*
						</label>
					</div>

					{/* Building Name */}
					<div className='relative'>
						<input
							type='text'
							id='buildingName'
							name='buildingName'
							required
							onChange={handleChange}
							value={formData.buildingName}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='buildingName'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Building Name*
						</label>
					</div>

					{/* Street */}
					<div className='relative'>
						<input
							type='text'
							id='street'
							name='street'
							required
							value={formData.street}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='street'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Street*
						</label>
					</div>

					{/* Landmark */}
					<div className='relative'>
						<input
							type='text'
							id='landmark'
							name='landmark'
							required
							onChange={handleChange}
							value={formData.landmark}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='landmark'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Landmark*
						</label>
					</div>

					{/* City */}
					<div className='relative'>
						<input
							type='text'
							id='city'
							name='city'
							required
							placeholder=' '
							value={formData.city}
							onChange={handleChange}
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='city'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							City*
						</label>
					</div>

					{/* State */}
					<div className='relative'>
						<input
							type='text'
							id='state'
							name='state'
							required
							value={formData.state}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='state'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							State*
						</label>
					</div>

					{/* Postal Code */}
					<div className='relative'>
						<input
							type='text'
							id='postalCode'
							name='postalCode'
							required
							value={formData.postalCode}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='postalCode'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Postal Code*
						</label>
					</div>

					{/* Address Type (Dropdown) */}
					<div className='flex flex-col space-y-1'>
						<h3>Address Type</h3>
						<div className='flex space-x-3 items-center'>
							{["Home", "Work", "Others"].map((opt) => (
								<label
									key={opt}
									className='flex items-center space-x-1 cursor-pointer'
								>
									<input
										type='radio'
										name='addressType'
										value={opt}
										checked={formData.addressType === opt}
										onChange={handleChange}
										className='h-4 w-4'
									/>
									<span className='text-gray-700'>{opt}</span>
								</label>
							))}
						</div>
					</div>
					<div className='relative'>
						<input
							type='text'
							id='country'
							name='country'
							required
							value={formData.country}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor='country'
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							Country*
						</label>
					</div>

					<div>
						<label className='flex items-center space-x-2'>
							<input
								type='checkbox'
								name='isDefault'
								checked={formData.isDefault}
								onChange={(e) =>
									setFormData({ ...formData, isDefault: e.target.checked })
								}
								className='h-4 w-4'
							/>
							<span>Mark as Default Address</span>
						</label>
					</div>

					{/* Submit Button */}
				</div>
			</div>
			<div className='flex border-2 border-yellow-500 mb-1'>
				<button
					type='button'
					onClick={() => setFormData({ ...formData, name: "", mobile: "" })} // reset minimal
					className=' border-none flex-1 py-2 hover:bg-gray-100 transition cursor-pointer'
				>
					Reset
				</button>
				<button
					onClick={handleSubmit}
					className='flex-1 bg-yellow-500 text-white py-2 focus:outline-none border-none hover:bg-yellow-600 cursor-pointer transition-all duration-200'
				>
					Save Address
				</button>
			</div>
		</div>
	);
};

export default AddressModify;
