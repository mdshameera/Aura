import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/profileSlice";
import Avatar from "react-avatar";
import { useState } from "react";
import AddressBook from "../components/profile/AddressBook";
import PersonalInformation from "../components/profile/PersonalInformation";
import Orders from "../components/Profile/Orders";
import Navbar from "../components/Navbar";
import { SpinnerInfinity } from "spinners-react";
import { RxHamburgerMenu } from "react-icons/rx";

const Profile = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);
	const [clickedTab, setClickedTab] = useState("orders");
	const { user, loading, error } = useSelector((state) => state.user);
	const [showProfileOptions, setShowProfileOptions] = useState(false);

	return (
		<div className='relative bg-[#F7F7F7] min-h-screen'>
			<Navbar />
			{loading == true && (
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
			{user && (
				<div className='m-5 flex flex-col items-center'>
					<div className='flex flex-col space-y-5 md:space-x-10 lg:space-x-10 xl:spaxe-x-10 md:flex-row lg:flex-row xl:flex-row'>
						<div className='p-6 md:w-[20vw] md:max-h-[40vh] lg:w-[20vw] lg:max-h-[40vh] flex-col bg-white space-y-1 shadow-lg font-semibold text-gray-800'>
							<div className='flex items-center justify-between'>
								<h1 className='font-Lora text-xl'>My Account</h1>
								<RxHamburgerMenu
									className='cursor-pointer min-md:hidden'
									onClick={() => setShowProfileOptions((p) => !p)}
								/>
							</div>
							<div className="p-3 max-md:hidden">
								<div
									name='orders'
									onClick={() => setClickedTab("orders")}
									className={`cursor-pointer ${
										clickedTab === "orders" ? "text-yellow-600" : ""
									}`}
								>
									Orders
								</div>
								<div
									name='personalInfo'
									onClick={() => setClickedTab("personalInfo")}
									className={`cursor-pointer ${
										clickedTab === "personalInfo" ? "text-yellow-600" : ""
									}`}
								>
									Personal Information
								</div>
								<div
									name='addressBook'
									onClick={() => setClickedTab("addressBook")}
									className={`cursor-pointer ${
										clickedTab === "addressBook" ? "text-yellow-600" : ""
									}`}
								>
									Address Book
								</div>
							</div>
							<div
								className={[
									"overflow-hidden md:hidden transition-[max-height,opacity] duration-500 ease-in-out mt-2",
									showProfileOptions
										? "max-h-96 opacity-100"
										: "max-h-0 opacity-0",
								].join(" ")}
							>
								<div
									name='orders'
									onClick={() => setClickedTab("orders")}
									className={`cursor-pointer ${
										clickedTab === "orders" ? "text-yellow-600" : ""
									}`}
								>
									Orders
								</div>
								<div
									name='personalInfo'
									onClick={() => setClickedTab("personalInfo")}
									className={`cursor-pointer ${
										clickedTab === "personalInfo" ? "text-yellow-600" : ""
									}`}
								>
									Personal Information
								</div>
								<div
									name='addressBook'
									onClick={() => setClickedTab("addressBook")}
									className={`cursor-pointer ${
										clickedTab === "addressBook" ? "text-yellow-600" : ""
									}`}
								>
									Address Book
								</div>
							</div>
						</div>

						<div className='shadow-lg min-md:w-[50vw] max-md:w-[80vw] min-h-[50vh] bg-white flex flex-col p-6'>
							{clickedTab === "addressBook" && <AddressBook />}
							{clickedTab === "personalInfo" && <PersonalInformation />}
							{clickedTab === "orders" && <Orders />}
						</div>
					</div>
				</div>
			)}

			{/* <button onClick={handleUpdate}>Update Profile</button>
			<button onClick={handleDelete}>Delete Account</button> */}
		</div>
	);
};

export default Profile;
