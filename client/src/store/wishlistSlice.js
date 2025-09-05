import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
const url = import.meta.env.VITE_BACKEND_URL;

// Add product to wishlist (calls backend)
export const addToWishlistAsync = createAsyncThunk(
	"wishlist/addToWishlistAsync",
	async ({ productId }, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.post(
				`${url}/api/wishlist/add`,
				{ prodId: productId },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("Added to wishlist");
			return response.data.updatedProduct;
		} catch (error) {
			if (error.status === 401) {
				toast.error("Session expired. Please login again");
			} else {
				toast.error(
					error.response?.data?.message || "Failed to add to wishlist"
				);
			}
			return rejectWithValue(
				error.response?.data?.message || "Failed to add to wishlist"
			);
		}
	}
);

// Remove product from wishlist (calls backend)
export const removeFromWishlistAsync = createAsyncThunk(
	"wishlist/removeFromWishlistAsync",
	async ({ productId }, { rejectWithValue, getState }) => {
		try {
			const token = getState()?.auth?.token;
			const response = await axios.post(
				`${url}/api/wishlist/remove`,
				{ prodId: productId },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast.success("Removed from wishlist");
			return response.data?.updatedProduct;
		} catch (error) {
			if (error.status === 401) {
				toast.error("Session expired. Please login again");
			} else {
				toast.error(
					error.response?.data?.message || "Failed to remove from wishlist"
				);
			}
			return rejectWithValue(
				error.response?.data?.message || "Failed to remove from wishlist"
			);
		}
	}
);

export const fetchWishlist = createAsyncThunk(
	"wishlist/fetchWishlist",
	async (_, { getState, rejectWithValue }) => {
		try {
			const token = getState()?.auth?.token;

			const response = await axios.get(`${url}/api/wishlist/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data.products;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch wishlist"
			);
		}
	}
);

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState: { wishlist: [], status: "idle", error: "" },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWishlist.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchWishlist.fulfilled, (state, action) => {
				state.status = "success";
				state.wishlist = action.payload;
			})
			.addCase(fetchWishlist.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addToWishlistAsync.fulfilled, (state, action) => {
				const payload = action.payload;
				const id = payload?._id ?? payload?.id;
				if (id) {
					if (!state.wishlist.some((i) => i._id === id || i.id === id)) {
						state.wishlist.push(payload);
					}
				}
			})
			.addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
				const payload = action.payload;
				// state.wishlist = state.wishlist.filter(
				// 	(item) => item !== action.payload
				// );
				const id = payload?._id ?? payload?.id ?? payload;
				if (id) {
					state.wishlist = state.wishlist.filter(
						(item) => item._id !== id && item.id !== id
					);
				}
			});
	},
});

// No local reducers to export
export default wishlistSlice.reducer;
