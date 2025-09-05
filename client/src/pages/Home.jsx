import { useSelector } from "react-redux";
import AllProducts from "../components/AllProducts";
import Filters from "../components/Filters";
import Navbar from "../components/Navbar";

const Home = () => {
	return (
		<>
			<Navbar />
			<div className='flex max-md:flex-col justify-center m-2'>
				<div className='md:w-[20%]'>
					<Filters />
				</div>
				<div className='md:w-[60%]'>
					<AllProducts />
				</div>
			</div>
		</>
	);
};

export default Home;
