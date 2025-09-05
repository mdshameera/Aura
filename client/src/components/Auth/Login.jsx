import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/authSlice";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import { FiKey } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { loading, token } = useSelector((state) => state.auth);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPass, setShowPass] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginUser(formData));
	};

	useEffect(() => {
		if (token) {
			navigate("/");
		}
	}, [token, navigate]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	return (
		<div className='flex justify-center min-h-screen'>
			<form onSubmit={handleSubmit} className='flex items-center flex-col'>
				<h1 className='text-3xl font-Lora font-semibold text-gray-700 mt-40 mb-10'>
					Enter your Space
				</h1>
				<div className='flex flex-col items-start space-y-3'>
					<div className='flex items-center space-x-3'>
						<IoMailOutline className='w-7 h-7' />
						<input
							type='text'
							name='email'
							placeholder='Email'
							className='p-2 w-full focus:outline-none border border-gray-400 items-center pr-2 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className='flex items-center space-x-1'>
						<div className='flex items-center space-x-3'>
							<FiKey className='w-7 h-7' />
							<input
								type={`${showPass ? "text" : "password"}`}
								name='password'
								placeholder='Password'
								className='p-2 w-full focus:outline-none border border-gray-400 items-center pr-2 focus:ring-1 focus:ring-yellow-400 focus:border-none hover:border-yellow-400 text-gray-500'
								value={formData.password}
								required
								onChange={handleChange}
							/>
						</div>

						<div
							className='cursor-pointer'
							onClick={() => setShowPass((prev) => !prev)}
						>
							{showPass ? <IoEyeOutline /> : <IoEyeOffOutline />}
						</div>
					</div>
				</div>
				<div className='flex items-center justify-center flex-col space-y-2'>
					<button
						disabled={loading}
						type='submit'
						className='border focus:outline-none border-yellow-400 px-5 py-3 mt-5 font-semibold hover:bg-yellow-500 hover:text-white hover:cursor-pointer transition-colors'
					>
						Sign In
					</button>
					<div className='text-sm text-center flex space-x-1'>
						<p className='text-gray-400'> Don't have an account?</p>
						<Link to='/signup' className='text-gray-500 underline'>
							{" "}
							Click here!
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
