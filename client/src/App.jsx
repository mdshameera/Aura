import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import Profile from "./pages/Profile";
import ShippingPage from "./components/ShippingPage";
import OrderDetails from "./pages/OrderDetails.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<Signup />} />
					<Route
						path='/wishlist'
						element={
							<PrivateRoute>
								<Wishlist />
							</PrivateRoute>
						}
					/>
					<Route
						path='/cart'
						element={
							<PrivateRoute>
								<Cart />
							</PrivateRoute>
						}
					/>
					<Route
						path='/shipping'
						element={
							<PrivateRoute>
								<ShippingPage />
							</PrivateRoute>
						}
					/>
					<Route
						path='/orders/:id'
						element={
							<PrivateRoute>
								<OrderDetails />
							</PrivateRoute>
						}
					/>
					<Route
						path='/profile'
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route path='/product/:id' element={<ProductDetails />} />
					<Route path='/order/summary' element={<OrderSummary />} />
				</Routes>
			</Router>
			<Toaster
				position='top-center'
				reverseOrder={false}
				toastOptions={{
					style: {
						background: "#333",
						color: "#fff",
					},
				}}
			/>
		</>
	);
}

export default App;
