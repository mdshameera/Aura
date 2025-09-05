import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = import.meta.env.VITE_BACKEND_URL;

export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async (
		{ skip = 0, limit = 30, category = [], minPrice, maxPrice } = {},
		{ rejectWithValue }
	) => {
		try {
			let query = `?skip=${skip}&limit=${limit}`;

			if (category.length > 0) {
				query += `&category=${category.join(",")}`;
			}

			if (minPrice || maxPrice) {
				query += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
			}

			const response = await axios.get(`${url}/api/products${query}`);

			return response.data.allProducts;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Failed to fetch products"
			);
		}
	}
);

export const fetchSingleProduct = createAsyncThunk(
	"products/fetchSingleProduct",
	async ({ id }, { rejectWithValue }) => {
		try {
			const response = await axios.get(`${url}/api/product/${id}`);
			return response.data.singleProduct;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Failed to fetch product"
			);
		}
	}
);

const initialState = {
	products: [],
	singleProduct: null,
	status: "idle",
	error: null,
};

const productSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		setProducts(state, action) {
			state.products = action.payload;
		},
		appendProducts(state, action) {
			state.products = [...state.products, ...action.payload];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.status = "success";
				if (action.meta.arg && action.meta.arg.skip > 0) {
					state.products = [...state.products, ...action.payload];
				} else {
					state.products = action.payload;
				}
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(fetchSingleProduct.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSingleProduct.fulfilled, (state, action) => {
				state.loading = false;
				state.singleProduct = action.payload;
			})
			.addCase(fetchSingleProduct.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { setProducts, appendProducts } = productSlice.actions;
export default productSlice.reducer;
