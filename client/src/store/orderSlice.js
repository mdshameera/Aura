// orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
const url = import.meta.env.VITE_BACKEND_URL;

export const placeOrder = createAsyncThunk(
	"order/placeOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.post(`${url}/api/orders/create`, orderData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			toast.success(res.data.message || "Order placed");
			return res.data;
		} catch (err) {
			toast.error(err.message || "Failed to order.");
			return rejectWithValue(err.response.data);
		}
	}
);

export const cancelOrder = createAsyncThunk(
	"order/cancelOrder",
	async (orderId, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`${url}/api/orders/${orderId}/cancel`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success(response.data.message || "order cancelled successfully");
			return response.data;
		} catch (err) {
			toast.error(err.message || "Failed to cancel order");
			return rejectWithValue(
				err.response?.data?.message || "Failed to cancel order"
			);
		}
	}
);

const orderSlice = createSlice({
	name: "order",
	initialState: {
		currentOrder: null,
		loading: false,
		error: null,
		status: "pending",
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(placeOrder.pending, (state) => {
				state.status = "pending";
				state.loading = true;
				state.error = null;
			})
			.addCase(placeOrder.fulfilled, (state, action) => {
				state.status = "success";
				state.loading = false;
				state.currentOrder = action.payload;
			})
			.addCase(placeOrder.rejected, (state, action) => {
				state.status = "failed";
				state.loading = false;
				state.error = action.payload || "Order failed";
			})
			.addCase(cancelOrder.fulfilled, (state, action) => {
				const updatedOrder = action.payload;
				state.user.orders = state.user.orders.map((o) =>
					o._id === updatedOrder._id ? updatedOrder : o
				);
			})
			.addCase(cancelOrder.rejected, (state, action) => {
				state.error = action.payload;
			});
	},
});

export default orderSlice.reducer;
