import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { BsHandbag, BsHandbagFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePopup from "./ProfilePopup";
import file from "../assets/logo.png";

const Navbar = () => {
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	return (
		<div className='flex p-2 min-md:px-10 z-10 sticky top-0 bg-white h-[10vh] items-center justify-between'>
			<div
				className='rounded-full cursor-pointer h-10 w-10 flex items-center space-x-2 bg-amber-200'
				onClick={() => navigate("/")}
			>
				<img src={file} alt='' />
				<h2 className='font-Lora text-3xl'>Aura</h2>
			</div>
			<div className='flex space-x-2 items-center justify-center'>
				{user && (
					<div
						className='p-2 rounded-full bg-yellow-400 w-10 h-10 cursor-pointer flex items-center justify-center'
						onClick={() => navigate("/wishlist")}
					>
						<IoMdHeartEmpty className='text-white text-xl' />
					</div>
				)}

				<div
					className='p-2 rounded-full bg-yellow-400 w-10 h-10 cursor-pointer flex items-center justify-center'
					onClick={() => navigate("/cart")}
				>
					<BsHandbag className='text-white text-xl' />
				</div>
				<div className='flex items-center justify-center'>
					{user ? (
						<ProfilePopup user={user} />
					) : (
						<div
							onClick={() => navigate("/login")}
							className='border-2 focus:outline-none border-yellow-400 px-5 py-2 font-semibold hover:bg-yellow-500 hover:text-white hover:cursor-pointer transition-colors'
						>
							Sign In
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
