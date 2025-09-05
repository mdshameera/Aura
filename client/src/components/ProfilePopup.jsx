import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { useDispatch} from "react-redux";
import { RiLogoutCircleLine } from "react-icons/ri";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePopup = ({ user }) => {
	const [open, setOpen] = useState(false);
	const popupRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Close popup if clicked outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<div ref={popupRef}>
			{/* Profile Icon */}
			{user && (
				<div onClick={() => setOpen(!open)} className='cursor-pointer relative'>
					<Avatar
						name={(user?.firstName || "") + " " + (user?.lastName || "")}
						color='oklch(85.2% 0.199 91.936)'
						round={true}
						size='40'
					/>
				</div>
			)}

			{/* Popup */}
			{user && open && (
				<div className='absolute right-2 mt-2 w-48 bg-smoke shadow-lg bg-white rounded-md z-50 transition-transform duration-200 scale-95 origin-top'>
					<div
						className='p-2 flex space-x-1 items-center hover:bg-gray-100 cursor-pointer'
						onClick={() => navigate("/profile")}
					>
						<Avatar
							name={(user?.firstName || "") + " " + (user?.lastName || "")}
							color='oklch(85.2% 0.199 91.936)'
							round={true}
							size='25'
						/>
						<p className='font-semibold'>
							{user?.firstName} {user?.lastName}
						</p>
					</div>
					<div
						className='flex items-center p-2 space-x-2 cursor-pointer hover:bg-gray-100'
						onClick={handleLogout}
					>
						<RiLogoutCircleLine />
						<p>Log out</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePopup;
