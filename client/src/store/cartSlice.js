import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const CART_KEY = "cart";

const url = import.meta.env.VITE_BACKEND_URL;

const loadCartFromLocalStorage = () => {
	try {
		const savedCart = localStorage.getItem(CART_KEY);
		return savedCart ? JSON.parse(savedCart) : [];
	} catch (e) {
		console.error("Failed to load cart from localStorage", e);
		return [];
	}
};

const saveCartToLocalStorage = (cart) => {
	try {
		localStorage.setItem(CART_KEY, JSON.stringify(cart));
	} catch (e) {
		console.error("Failed to save cart to localStorage", e);
	}
};

// Add product to cartlist (calls backend)
export const addToCartAsync = createAsyncThunk(
	"cart/addToCartAsync",
	async ({ productId }, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.post(
				`${url}/api/cart/add`,
				{ productId: productId },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("Product added to cart", {
				style: { borderRadius: "12px" },
			});
			return response.data.product;
		} catch (error) {
			if (error.status === 401) {
				toast.error("Please login to add to bag", {
					style: { borderRadius: "12px !important" },
				});
			} else {
				toast.error(error.response?.data?.message || "Failed to add to cart");
			}
			return rejectWithValue(
				error.response?.data?.message || "Failed to add to cart"
			);
		}
	}
);

// Remove product from cartlist (calls backend)
export const removeFromCartAsync = createAsyncThunk(
	"cart/removeFromCartAsync",
	async ({ productId }, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.post(
				`${url}/api/cart/remove`,
				{ productId: productId },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("Removed from cart");
			return response.data?.removedProductId;
		} catch (error) {
			if (error.status === 401) {
				toast.error("Session expired. Please login again");
			} else {
				toast.error(
					error.response?.data?.message || "Failed to remove from cart"
				);
			}
			return rejectWithValue(
				error.response?.data?.message || "Failed to remove from cart"
			);
		}
	}
);

// Update product quantity in cart
export const updateCartQuantityAsync = createAsyncThunk(
	"cart/updateCartQuantityAsync",
	async ({ productId, quantity }, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.put(
				`${url}/api/cart/update`,
				{ productId, quantity },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data?.removedProductId) {
				return { removedProductId: response.data.removedProductId };
			}
			if (response.data?.product) {
				return { product: response.data.product };
			}
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update quantity"
			);
		}
	}
);

export const fetchCart = createAsyncThunk(
	"cart/fetchCart",
	async (_, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.get(`${url}/api/cart/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data.cart;
		} catch (error) {
			if (error.status === 401) {
				toast.error("Session expired. Please login again");
			}
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch wishlist"
			);
		}
	}
);

const cartSlice = createSlice({
	name: "cart",
	initialState: { cart: loadCartFromLocalStorage(), status: "idle", error: "" },
	reducers: {
		removeOrderedProducts: (state, action) => {
			const orderedIds = action.payload; // array of product IDs
			state.cart = state.cart.filter(
				(item) => !orderedIds.includes(item.product._id)
			);
			saveCartToLocalStorage(state.cart);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCart.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchCart.fulfilled, (state, action) => {
				state.status = "success";
				state.cart = action.payload;
				saveCartToLocalStorage(state.cart);
			})
			.addCase(fetchCart.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(removeFromCartAsync.fulfilled, (state, action) => {
				const removedId = action.payload;
				state.cart = state.cart.filter(
					(item) => item?.product?._id !== removedId
				);
				saveCartToLocalStorage(state.cart);
			})
			.addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
				const { product: updatedItem, removedProductId } = action.payload || {};

				if (removedProductId) {
					state.cart = state.cart.filter(
						(item) => item.product._id !== removedProductId
					);
				} else if (updatedItem) {
					state.cart = state.cart.map((item) =>
						item.product._id === updatedItem.product._id ? updatedItem : item
					);
				}

				saveCartToLocalStorage(state.cart);
			});
	},
});

export const { removeOrderedProducts } = cartSlice.actions;
export default cartSlice.reducer;
