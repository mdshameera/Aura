import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addToWishlistAsync,
	fetchWishlist,
	removeFromWishlistAsync,
} from "../store/wishlistSlice";
import ProductCard from "../components/ProductCard";
import { SpinnerInfinity } from "spinners-react";
import notFoundImg from "../assets/404.svg";
import noResults from "../assets/noResults.svg";
import wishlistImg from "../assets/wishlist.svg";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Wishlist = () => {
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);
	const { wishlist, status } = useSelector((state) => state.wishlist);

	const handleWishClick = async (product) => {
		const isWished = wishlist.some((item) => item._id === product._id);
		if (isWished) {
			await dispatch(removeFromWishlistAsync({ productId: product._id }));
		} else {
			await dispatch(addToWishlistAsync({ productId: product._id }));
		}
		// Awaiting dispatch ensures Redux state is updated before UI re-renders
	};

	useEffect(() => {
		if (token) {
			dispatch(fetchWishlist());
		}
	}, [dispatch, token]);
	const navigate = useNavigate();

	return (
		<>
			<Navbar />
			<div className='flex flex-col items-center p-2 space-y-3'>
				<h1 className='font-Lora text-4xl max-md:text-2xl'>My WishList</h1>
				<div className='flex items-center justify-center'>
					{status === "loading" && (
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
					<div className='grid grid-cols-4 gap-2 min-sm:grid-cols-3 max-sm:grid-cols-2 max-sm:gap-5 sm:gap-8'>
						{status === "success" &&
							wishlist.length > 0 &&
							wishlist.map((product) => (
								<ProductCard
									wishlist={wishlist}
									handleWishClick={handleWishClick}
									product={product}
								/>
							))}
					</div>
					{status === "success" && wishlist.length === 0 && (
						<div className='mt-20 space-y-3 flex flex-col items-center'>
							<img src={wishlistImg} alt='' className='w-70' />
							<h1 className='capitalize text-xl font-Lora font-medium text-center'>
								Try browsing our vast catalog to see
								<br /> your favourite products here!
							</h1>
							<button
								className='uppercase cursor-pointer tracking-wider font-medium border text-yellow-500 border-yellow-500 p-3'
								onClick={() => navigate("/")}
							>
								browse catalog
							</button>
						</div>
					)}
					{status === "failed" && (
						<div className='mt-20 space-y-3'>
							<img src={notFoundImg} alt='' className='w-100' />
							<h1 className='capitalize text-xl font-Lora font-medium text-center'>
								Awww.. Something happened on our end!
								<br /> Rest aside, we'll be back soon!
							</h1>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Wishlist;
