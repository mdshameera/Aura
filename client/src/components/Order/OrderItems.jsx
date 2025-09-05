import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pickGradient } from "../../utils/gradient";
import { fetchProducts, fetchSingleProduct } from "../../store/productSlice";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const OrderItems = ({ items }) => {
	const { products } = useSelector((state) => state.products);
	const [showOrderItems, setShowOrderItems] = useState(true);
	const dispatch = useDispatch();

	// Fetch products if not already in store
	useEffect(() => {
		if (!products || products?.length === 0) {
			dispatch(fetchProducts());
		}
	}, [dispatch, products]);

	if (!items || items?.length === 0) {
		return <p className='text-center text-gray-500'>No items to display.</p>;
	}

	const productInStore = (it) => products.find((p) => p._id === it.product);
	items.forEach((item) => {
		if (!productInStore(item) && item.product) {
			dispatch(fetchSingleProduct({ id: item.product }));
		}
	});

	return (
		<div>
			<div className='shadow-lg bg-white p-6 rounded w-full md:w-[50vw] max-md:w-[80vw]'>
				<div className='flex items-center justify-between'>
					<h3 className='font-Lora font-semibold'>Order Items</h3>
					<button
						onClick={() => setShowOrderItems((s) => !s)}
						className='cursor-pointer'
					>
						{showOrderItems ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
					</button>
				</div>

				<div
					className={[
						"overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out mt-2",
						showOrderItems ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
					].join(" ")}
				>
					{items.map((item, idx) => {
						const bgStyle = {
							background: pickGradient(
								item?.productId || item?.productName || Math.random().toString()
							),
						};
						const productInStore = products.find(
							(p) => p._id === item?.productId
						);

						return (
							<div
								key={idx}
								className='flex border-b items-center justify-between border-gray-300 py-2 space-x-5'
							>
								<div className='flex space-x-2'>
									<img
										src={item?.productImage}
										alt={item?.productName}
										className='w-16 h-16 object-contain rounded'
										style={bgStyle}
									/>
									<div className='flex flex-col justify-between'>
										<div>
											<div className='flex space-x-2 items-center'>
												<p className='text-yellow-700 font-semibold text-sm max-md:text-xs tracking-tighter'>
													{productInStore?.brand || "Walmart"}
												</p>
												{productInStore?.category && (
													<p className='capitalize bg-gray-300 text-gray-950 font-semibold px-2 py-1 rounded-xl text-xs max-sm:text-[10px] text-center'>
														{productInStore?.category}
													</p>
												)}
											</div>
											<p className='text-sm font-semibold max-sm:text-xs text-gray-600 font-Lora'>
												{item?.productName}
											</p>
											<div className='border min-md:hidden px-2 py-1 mt-1 text-xs max-sm:text-[10px] w-12 rounded text-center'>
												<p className='text-gray-600 font-semibold'>
													{item?.quantity} x {item?.priceAtPurchase}
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className='flex items-center space-x-2'>
									<div className='border px-2 py-1 max-md:hidden text-xs max-sm:text-[10px] rounded text-center'>
										<p className='text-gray-600 font-semibold'>
											{item?.quantity} x {item?.priceAtPurchase}
										</p>
									</div>
									<p className='text-gray-700 font-bold tracking-wide text-xl max-sm:text-lg'>
										<span className='mr-0.5'>{"\u20B9"}</span>
										{item?.priceAtPurchase * item?.quantity}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default OrderItems;
