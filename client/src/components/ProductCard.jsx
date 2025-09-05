import React from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { Link } from "react-router-dom";
import { pickGradient } from "../utils/gradient";
import { useDispatch, useSelector } from "react-redux";
import {
	addToWishlistAsync,
	removeFromWishlistAsync,
} from "../store/wishlistSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product, wishlist }) => {
	const bgStyle = {
		background: pickGradient(
			product._id || product.title || Math.random().toString()
		),
	};

	const { user } = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	const handleWishClick = async (product) => {
		const isWished = wishlist.some((item) => item._id === product._id);
		if (isWished) {
			await dispatch(removeFromWishlistAsync({ productId: product._id }));
		} else {
			await dispatch(addToWishlistAsync({ productId: product._id }));
		}
		// Awaiting dispatch ensures Redux state is updated before UI re-renders
	};

	return (
		<div className='flex flex-col items-center'>
			<div
				className='aspect-[3/4] w-[30vw] max-sm:w-[35vw] max-md:w-[30vw] max-lg:w-[20vw] lg:w-[15vw] relative flex items-center justify-center overflow-hidden rounded-lg'
				style={bgStyle}
			>
				<Link
					to={`/product/${product?._id}`}
					state={{ product }}
					className='flex-1'
				>
					<img
						src={product.thumbnail}
						alt={product.title}
						className='w-full h-full object-contain'
					/>
				</Link>

				<div className='px-2 py-1 left-1 bottom-1 md:left-3 md:bottom-3 lg:left-3 lg:bottom-3 absolute rounded-3xl justify-center blur-bg-xl bg-gray-200 text-green-500 text-xs items-center flex gap-1'>
					<p className='shadow-green-500/50 md:text-xs lg:text-xs text-[10px]'>
						{product.rating}
					</p>
					<span className='md:text-xs lg:text-xs text-[10px]'>{"\u2605"}</span>
					<span>|</span>
					<span className='md:text-xs lg:text-xs text-[10px]'>
						{product.reviews ? product.reviews.length : 0}
					</span>
				</div>
			</div>
			<div className='flex w-[30vw] max-sm:w-[35vw] max-md:w-[30vw] max-lg:w-[20vw] lg:w-[15vw] mt-2 items-start justify-between'>
				<Link
					to={`/product/${product?._id}`}
					state={{ product }}
					className='flex-1'
				>
					<div className='text-left'>
						<h4 className='text-yellow-700 font-semibold text-[12px] min-sm:text-xs min-md:text-sm  tracking-tighter'>
							{product.brand || "Walmart"}
						</h4>
						<h2 className='text-[12px] min-sm:text-xs min-md:text-sm font-semibold text-gray-600 font-Lora'>
							{product.title}
						</h2>
						<div className='flex space-x-1'>
							<p className='text-gray-700 text-[12px] min-sm:text-xs min-md:text-sm font-semibold tracking-tighter'>
								<span className='md:mr-0.5 lg:mr-0.5'>{"\u20B9"}</span>
								{Math.trunc(product.price * 85)}
							</p>
							<p className=' line-through text-[12px] min-sm:text-xs min-md:text-sm font-light text-gray-400 tracking-tighter'>
								<span>{"\u20B9"}</span>
								{Math.trunc(
									(product.price +
										(product.price * product.discountPercentage) / 100) *
										85
								)}
							</p>
						</div>
					</div>
				</Link>
				<div
					className='bg-gray-200 cursor-pointer rounded-full w-6 h-6 p-1 md:w-8 md:h-8 md:p-2 lg:w-8 lg:h-8 lg:p-2 text-lg flex items-center justify-center ml-2'
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						if (!user) {
							toast.error("Please login to add to wishlist");
							return;
						}
						handleWishClick(product);
					}}
				>
					{wishlist.some((item) => item._id === product._id) ? (
						<IoMdHeart className=' text-red-500' />
					) : (
						<IoMdHeartEmpty className=' text-red-500' />
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
