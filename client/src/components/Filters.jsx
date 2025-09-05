import React, { useEffect, useState } from "react";
import {
	FaMinus,
	FaPlus,
} from "react-icons/fa6";
import { MdArrowForward, MdDone } from "react-icons/md";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../store/productSlice";
import { TbFilterSearch } from "react-icons/tb";

const Filters = ({ categories = [], brands = [], onFilterChange }) => {
	const [selectedCategory, setSelectedCategory] = useState([]);
	const dispatch = useDispatch();
	const [priceRangeState, setPriceRangeState] = useState({
		minPrice: null,
		maxPrice: null,
	});
	const [customRange, setCustomRange] = useState({
		minPrice: null,
		maxPrice: null,
	});
	const [isCat, setIsCat] = useState(false);
	const [isPriceRange, setIsPriceRange] = useState(false);
	const [isFilter, setIsFilter] = useState(false);
	const categoryList = [
		"beauty",
		"fragrances",
		"furniture",
		"groceries",
		"home-decoration",
		"kitchen-accessories",
		"laptops",
		"mens-shirts",
		"mens-shoes",
		"mens-watches",
		"mobile-accessories",
		"motorcycle",
		"skin-care",
		"smartphones",
		"sports-accessories",
		"sunglasses",
		"tablets",
		"tops",
		"vehicle",
		"womens-bags",
		"womens-dresses",
		"womens-jewellery",
		"womens-shoes",
		"womens-watches",
	];

	const priceRanges = [
		{ label: "Rs.100-Rs.500", min: 100, max: 500 },
		{ label: "Rs.500-Rs.1000", min: 500, max: 1000 },
		{ label: "Rs.1000-Rs.1500", min: 1000, max: 1500 },
		{ label: "Rs.1500-Rs.2000", min: 1500, max: 2000 },
		{ label: "Rs.2000-Rs.2500", min: 2000, max: 2500 },
	];

	const handleCategoryChange = (item) => {
		if (!itemInSelectedCat(item)) {
			setSelectedCategory((p) => [...p, item]);
		} else {
			setSelectedCategory((p) => p.filter((it) => item !== it));
		}
		setIsCat(false);
	};

	const handlePriceRangeChange = (item) => {
		if (!itemInSelectedRange(item)) {
			setPriceRangeState({
				minPrice: item.min,
				maxPrice: item.max,
			});
		} else {
			setPriceRangeState({
				minPrice: null,
				maxPrice: null,
			});
		}
		setIsPriceRange(false);
	};

	const handleCustomRange = () => {
		setPriceRangeState({
			minPrice: customRange.minPrice,
			maxPrice: customRange.maxPrice,
		});
		
		setIsPriceRange(false);
	};

	const itemInSelectedRange = (item) => {
		return (
			priceRangeState.minPrice === item.min &&
			priceRangeState.maxPrice === item.max
		);
	};

	const itemInSelectedCat = (item) => {
		return selectedCategory.includes(item);
	};

	useEffect(() => {
		dispatch(
			fetchProducts({
				skip: 0,
				limit: 30,
				category: selectedCategory,
				minPrice: Number(priceRangeState.minPrice),
				maxPrice: Number(priceRangeState.maxPrice),
			})
		);
	}, [selectedCategory, dispatch, priceRangeState]);

	return (
		<div className='flex flex-col mb-4'>
			<div className='flex items-center min-md:justify-between max-md:justify-end'>
				<h1 className='font-Lora min-md:text-xl max-md:hidden'>Refine By</h1>
				<div
					onClick={() => setIsFilter((prev) => !prev)}
					className='cursor-pointer min-md:hidden border hover:text-yellow-500 transition-all duration-200 p-2 rounded border-gray-300'
				>
					<TbFilterSearch />
				</div>
			</div>
			<div className={`px-3  ${isFilter ? ":" : "max-md:hidden"}`}>
				<div className='border-b border-gray-300 py-2'>
					<div className='flex space-x-2 items-center'>
						<div
							onClick={() => setIsCat((prev) => !prev)}
							className='cursor-pointer'
						>
							{isCat ? <FaMinus /> : <FaPlus />}
						</div>
						<h3>Category</h3>
					</div>
					<div className='px-3'>
						{isCat &&
							categoryList.map((item, indx) => (
								<div key={indx} className='flex space-x-2 items-center'>
									<div
										className={`w-3 h-3 rounded border cursor-pointer flex items-center justify-center transition-all duration-300 ${
											itemInSelectedCat(item) ? "bg-yellow-400 border-none" : ""
										}`}
										onClick={() => handleCategoryChange(item)}
									>
										<div>
											{itemInSelectedCat(item) ? (
												<MdDone className='w-3 h-3 text-white' />
											) : (
												""
											)}
										</div>
									</div>
									<p className='text-sm tracking-wide capitalize'>{item}</p>
								</div>
							))}
					</div>
				</div>
				<div className='border-b border-gray-300 py-2'>
					<div className='flex space-x-2 items-center'>
						<div
							onClick={() => setIsPriceRange((prev) => !prev)}
							className='cursor-pointer'
						>
							{isPriceRange ? <FaMinus /> : <FaPlus />}
						</div>
						<h3>Price</h3>
					</div>
					<div className='px-3'>
						<div>
							{isPriceRange &&
								priceRanges.map((item, idx) => (
									<div key={idx} className='flex space-x-2 items-center'>
										<div
											className={`w-3 h-3 rounded border cursor-pointer flex items-center justify-center transition-all duration-300 ${
												itemInSelectedRange(item)
													? "bg-yellow-400 border-none"
													: ""
											}`}
											onClick={() => handlePriceRangeChange(item)}
										>
											<div>
												{itemInSelectedRange(item) ? (
													<MdDone className='w-3 h-3 text-white' />
												) : (
													""
												)}
											</div>
										</div>
										<p className='text-sm tracking-wide capitalize'>
											{item.label}
										</p>
									</div>
								))}
						</div>
						{isPriceRange && (
							<div>
								<p className='text-sm text-gray-700 my-1'>Custom Range</p>
								<div className='flex items-center space-x-2'>
									<div className='flex items-center space-x-1'>
										<input
											type='text'
											placeholder='Min'
											value={customRange.minPrice}
											onChange={(e) =>
												setCustomRange((prev) => ({
													...prev,
													minPrice: Number(e.target.value) || 0,
												}))
											}
											className='border focus:outline-none p-2 w-15 integer'
										/>
										<span className='mx-2'>-</span>
										<input
											type='text'
											value={customRange.maxPrice}
											onChange={(e) =>
												setCustomRange((prev) => ({
													...prev,
													maxPrice: Number(e.target.value) || 0,
												}))
											}
											placeholder='Max'
											className='border focus:outline-none p-2 w-15 integer'
										/>
									</div>

									<div
										className='p-1 border rounded-full cursor-pointer h-6 w-6 flex items-center justify-center'
										onClick={() => handleCustomRange()}
									>
										<MdArrowForward />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Filters;
