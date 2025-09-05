import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_BACKEND_URL;

export const fetchUser = createAsyncThunk(
	"user/fetchUser",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.get(`${url}/api/user/`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data.user;
		} catch (err) {
			return rejectWithValue(
				err.response?.data?.message || "Failed to fetch user"
			);
		}
	}
);

export const updateUser = createAsyncThunk(
	"user/updateUser",
	async (userData, { rejectWithValue }) => {
		try {
			const res = await axios.put(`${url}/api/user/`, userData, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			toast.success("Profile updated successfully");
			return res.data.user;
		} catch (err) {
			toast.error(err.response?.data?.message || "Update failed");
			return rejectWithValue(
				err.response?.data?.message || "Failed to update user"
			);
		}
	}
);

export const deleteUser = createAsyncThunk(
	"user/deleteUser",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`${url}/api/user/`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			toast.success("Account deleted successfully");
			localStorage.removeItem("token"); // optional
			return true;
		} catch (err) {
			toast.error(err.response?.data?.message || "Delete failed");
			return rejectWithValue(
				err.response?.data?.message || "Failed to delete user"
			);
		}
	}
);

export const updateAddress = createAsyncThunk(
	"user/updateAddress",
	async ({ editData, addressId }, { rejectWithValue }) => {
		try {
			const res = await axios.put(`${url}/api/address/${addressId}`, editData, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			toast.success("Address updated successfully");
			return res.data.addresses;
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Failed to update. Please try later"
			);
			return rejectWithValue(
				err.response?.data?.message || "Failed to update address"
			);
		}
	}
);

export const deleteAddress = createAsyncThunk(
	"user/deleteAddress",
	async (addressId, { rejectWithValue }) => {
		try {
			const res = await axios.delete(`${url}/api/address/${addressId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			toast.success("Address deleted successfully");
			return res.data.addresses;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to delete address");
			return rejectWithValue(
				err.response?.data?.message || "Failed to delete address"
			);
		}
	}
);

export const addAddress = createAsyncThunk(
	"user/addAddress",
	async (addressData, { rejectWithValue }) => {
		try {
			const res = await axios.post(`${url}/api/address`, addressData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			toast.success("Address added successfully");
			return res.data.addresses;
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to add address");
			return rejectWithValue(
				err.response?.data?.message || "Failed to add address"
			);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		user: null,
		loading: false,
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			localStorage.removeItem("token");
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch
			.addCase(fetchUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Update
			.addCase(updateUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})

			// Delete
			.addCase(deleteUser.fulfilled, (state) => {
				state.loading = false;
				state.user = null;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			//Update Address
			.addCase(updateAddress.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateAddress.fulfilled, (state, action) => {
				state.loading = false;
				if (state.user) {
					state.user.addresses = action.payload;
				}
			})
			.addCase(updateAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			//Delete Address
			.addCase(deleteAddress.pending, (state) => {
				state.loading = true;
			})
			.addCase(deleteAddress.fulfilled, (state, action) => {
				state.loading = false;
				state.user.addresses = action.payload;
			})
			.addCase(deleteAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			//Add new Address
			.addCase(addAddress.pending, (state) => {
				state.loading = true;
			})
			.addCase(addAddress.fulfilled, (state, action) => {
				state.loading = false;
				if (state.user) {
					state.user.addresses = action.payload;
				}
			})
			.addCase(addAddress.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
