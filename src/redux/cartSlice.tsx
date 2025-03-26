import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {fetchCartAPI} from "../services/cartSliceService.tsx";

interface CartItem {
    id_sach: string;
    so_luong: number;
    book_info: {
        ten_sach: string;
        gia: number;
        anh: string;
    };
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        return await fetchCartAPI();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {}, // Không cần reducer vì chỉ fetch dữ liệu

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalItems = action.payload.length;
                state.totalPrice = action.payload.reduce((sum, item) => sum + item.book_info.gia * item.so_luong, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default cartSlice.reducer;
