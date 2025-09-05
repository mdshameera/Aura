import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import notFoundImg from "../assets/404.svg";
import {
	addToWishlistAsync,
	fetchWishlist,
	removeFromWishlistAsync,
} from "../store/wishlistSlice";
import ProductCard from "./ProductCard";
import { SpinnerInfinity } from "spinners-react";

const AllProducts = () => {
	const dispatch = useDispatch();
	const { products, status } = useSelector((state) => state.products);
	const { wishlist } = useSelector((state) => state.wishlist);
	const { token } = useSelector((state) => state.auth);
	const [skip, setSkip] = useState(0);
	const limit = 30;

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchProducts({ skip: 0, limit }));
			setSkip(limit);
		}
	}, [status, dispatch]);

	useEffect(() => {
		if (token) {
			dispatch(fetchWishlist());
		}
	}, [dispatch, token]);

	const handleViewMore = () => {
		dispatch(fetchProducts({ skip, limit }));
		setSkip(skip + limit);
	};

	return (
		<div>
			<div className='flex flex-col items-center justify-center space-y-2'>
				{status === "loading" && (
					<SpinnerInfinity
						size={90}
						thickness={111}
						speed={100}
						color='rgba(255, 235, 59, 1)'
						secondaryColor='rgba(158, 172, 57, 0.22)'
					/>
				)}
				{status === "success" && (
					<>
						{products.length > 0 ? (
							<div className='grid min-sm:grid-cols-3 max-sm:grid-cols-2 max-sm:gap-5 sm:gap-8'>
								{products.map((product) => (
									<ProductCard
										key={product._id}
										wishlist={wishlist}
										product={product}
									/>
								))}
							</div>
						) : (
							<div>
								<h1>No products to show</h1>
							</div>
						)}

						{products.length === 30 && (
							<div className='flex justify-center my-4'>
								<button
									onClick={handleViewMore}
									className='px-6 py-2 text-yellow-500 border tracking-tight shadow-md cursor-pointer transition-colors duration-200'
								>
									View More
								</button>
							</div>
						)}
					</>
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
	);
};

export default AllProducts;
