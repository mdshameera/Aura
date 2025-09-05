// store.js
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import orderReducer from "./orderSlice";

// Save state to localStorage
const saveState = (state) => {
	try {
		localStorage.setItem(
			"reduxState",
			JSON.stringify({
				auth: state.auth,
				user: state.user,
				cart: state.cart,
				wishlist: state.wishlist,
			})
		);
	} catch (err) {
		console.error("Error saving state", err);
	}
};

const loadState = () => {
	try {
		const state = localStorage.getItem("reduxState");
		return state ? JSON.parse(state) : undefined;
	} catch (err) {
		console.error("Error loading state", err);
		return undefined;
	}
};

const store = configureStore({
	reducer: {
		products: productsReducer,
		cart: cartReducer,
		wishlist: wishlistReducer,
		auth: authReducer,
		user: profileReducer,
		order: orderReducer,
	},
	preloadedState: loadState(),
});

// Save state changes
store.subscribe(() => {
	saveState(store.getState());
});

export default store;
