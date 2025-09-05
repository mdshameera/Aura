import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/profileSlice";

const PersonalInformation = () => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const getInitialFormData = (user) => ({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
		phone: user?.phone || "",
		dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
	});
	useEffect(() => {
		if (user) {
			setFormData(getInitialFormData(user));
		}
	}, [user]);
	const [formData, setFormData] = useState(getInitialFormData(user));
	const values = [
		{ key: "firstName", label: "First Name" },
		{ key: "lastName", label: "Last Name" },
		{ key: "email", label: "Email" },
		{ key: "phone", label: "Phone" },
		{ key: "dob", label: "Date of Birth" },
	];
	const requiredFields = ["firstName", "email"];
	const fieldTypes = {
		email: "email",
		phone: "tel",
		dob: "date",
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	const handleSave = (e) => {
		e.preventDefault();
		dispatch(updateUser(formData));
	};

	const handleReset = () => {
		setFormData(getInitialFormData(user));
	};
	return (
		<div>
			<div className="mb-2">
				<h3 className='text-4xl max-md:text-xl text-center text-gray-800 font-Lora'>
					Personal Information
				</h3>
				<p className='text-center max-md:text-xs text-gray-800 text-sm font-Source'>
					Hey There!, Save your Information for a personalized shopping
					experience.
				</p>
			</div>
			<div className='space-y-1'>
				{values.map((val, idx) => (
					<div className='relative' key={idx}>
						<input
							type={fieldTypes[val.key] || "text"}
							id={val.key}
							name={val.key}
							required={requiredFields.includes(val.key)}
							value={formData[val.key] || ""}
							onChange={handleChange}
							placeholder=' '
							className='peer w-full border-b px-3 pt-5 pb-2 text-sm border-gray-500 focus:outline-none focus:border-yellow-500'
						/>
						<label
							htmlFor={val.key}
							className='absolute left-0 top-0 text-xs text-gray-900 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-focus:top-0  peer-focus:text-xs peer-focus:text-yellow-500'
						>
							{val.label} {requiredFields.includes(val.key) && "*"}
						</label>
					</div>
				))}
			</div>
			<div className='flex border-2 border-yellow-500 my-5'>
				<button
					type='button'
					onClick={() => handleReset()}
					className=' border-none flex-1 py-2 hover:bg-gray-100 transition cursor-pointer'
				>
					Reset
				</button>
				<button
					onClick={handleSave}
					className='flex-1 bg-yellow-500 text-white py-2 focus:outline-none border-none hover:bg-yellow-600 cursor-pointer transition-all duration-200'
				>
					Save Address
				</button>
			</div>
		</div>
	);
};

export default PersonalInformation;
