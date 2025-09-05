import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [rePass, setRePass] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(signupUser(formData));
	};

	useEffect(() => {
		if (token) {
			navigate("/");
		}
	}, [token, navigate]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRePass = (e) => {
		setRePass(e.target.value);
	};

	const isSamePass = () => {
		return formData.password === rePass;
	};

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<form
				onSubmit={handleSubmit}
				className='flex items-center justify-center flex-col'
			>
				<h1 className='text-2xl font-Lora font-semibold text-gray-700 mb-10'>
					Register for your experience
				</h1>
				<div className='flex flex-col items-start space-y-3 w-full'>
					<div className='flex items-center space-x-3 w-full'>
						<input
							type='text'
							name='firstName'
							placeholder='First Name'
							className='p-2 focus:outline-none border border-gray-400 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
							value={formData.firstName}
							onChange={handleChange}
							required
						/>
						<input
							type='text'
							name='lastName'
							placeholder='Last Name'
							className='p-2 focus:outline-none border border-gray-400 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
							value={formData.lastName}
							onChange={handleChange}
						/>
					</div>
					<input
						type='text'
						name='email'
						placeholder='your@example.com'
						className='p-2 w-full focus:outline-none border border-gray-400 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
						value={formData.email}
						onChange={handleChange}
						required
					/>

					<input
						type='password'
						name='password'
						placeholder='Enter your password'
						className='p-2 w-full focus:outline-none border border-gray-400 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
						value={formData.password}
						required
						onChange={handleChange}
					/>

					<input
						type='password'
						name='rePass'
						placeholder='Confirm your password'
						className={`p-2 w-full focus:outline-none border border-gray-400 ${
							isSamePass() ? "focus:ring-yellow-400" : "focus:ring-red-500"
						} focus:ring-1  focus:border-none hover:border-yellow-400 text-gray-500`}
						value={rePass}
						required
						onChange={handleRePass}
					/>
				</div>
				<div className='flex items-center justify-center flex-col space-y-1'>
					<button
						disabled={!isSamePass}
						type='submit'
						className='border focus:outline-none border-yellow-400 px-5 py-3 mt-10 font-semibold hover:bg-yellow-500 hover:text-white hover:cursor-pointer transition-colors'
					>
						Sign up
					</button>
					<div className='text-sm text-center flex space-x-1'>
						<p className='text-gray-400'> Already have an account?</p>
						<Link to='/login' className='text-gray-500'>
							{" "}
							Click here!
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Signup;
