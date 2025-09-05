import React from "react";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../../store/profileSlice";
import { CiEdit } from "react-icons/ci";

const AddressBlock = ({ address, setIsOpen }) => {
	const dispatch = useDispatch();
	const handleDeleteAddress = () => {
		if (window.confirm("Are you sure you want to delete this address?")) {
			dispatch(deleteAddress(address?._id));
		}
	};
	return (
		<div className='flex flex-col justify-between md:w-[15vw] md:h-[25vh] border border-gray-100 rounded-sm bg-yellow-50 p-3 space-y-1'>
			<div>
				<div className='flex space-x-2 items-center'>
					<h4 className='font-semibold'>{address.name}</h4>
					<div className='uppercase border px-1 text-xs rounded-md text-yellow-900'>
						<p>{address.addressType}</p>
					</div>
				</div>
				<p className='text-xs font-semibold text-yellow-900'>
					{address.isDefault && "Default"}
				</p>
				<div className='text-gray-500 text-sm'>
					<p>{address.buildingName + ", " + address.street}</p>
					<p>{address.Landmark}</p>
					<p>{address.city + ", " + address.state}</p>
					<p>{address.country + " - " + address.postalCode}</p>
				</div>
			</div>
			<div>
				<h4 className='text-gray-500 text-sm'>
					Phone :{" "}
					<span className='font-semibold text-gray-800'>{address.mobile}</span>
				</h4>
				<div className='flex space-x-2 font-semibold'>
					<div
						className='cursor-pointer flex space-x-1 items-center text-sm'
						onClick={() => setIsOpen(true)}
					>
						<CiEdit />
						<p>Edit</p>
					</div>
					<div
						className='cursor-pointer text-sm'
						onClick={() => handleDeleteAddress()}
					>
						<p>Delete</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressBlock;
