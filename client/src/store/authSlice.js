import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_BACKEND_URL;

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(`${url}/api/auth/login`, {
				email,
				password,
			});
			localStorage.setItem("token", data.token);
			toast.success("LogIn successful");
			return data;
		} catch (error) {
			toast.error(error.response.data.message || "Login Failed");
			return rejectWithValue(error.response?.data?.message || "Login failed");
		}
	}
);

export const signupUser = createAsyncThunk(
	"auth/signup",
	async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
		try {
			const { data } = await axios.post(`${url}/api/auth/signup`, {
				firstName,
				lastName,
				email,
				password,
			});
			localStorage.setItem("token", data.token);
			toast.success("Signup successful");
			return data;
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message || "Signup failed");

			return rejectWithValue(error.response?.data?.message || "Signup failed");
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: JSON.parse(localStorage.getItem("user")) || null,
		token: localStorage.getItem("token") || null,
		loading: false,
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			state.token = null;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("cart");
			localStorage.removeItem("reduxState");
			toast.success("Logout successful");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem("user", JSON.stringify(action.payload.user));
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(signupUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(signupUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.user;
				state.token = action.payload.token;
				localStorage.setItem("user", JSON.stringify(action.payload.user));
			})
			.addCase(signupUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
