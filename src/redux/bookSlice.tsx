import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBooks, createBook } from '../services/bookService';

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
        try {
            const data = await getBooks(page, limit);
            return data;
        } catch (error: any) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const addBook = createAsyncThunk(
    'books/addBook',
    async (
        newBook: {
            id_sach: string;
            ten_sach: string;
            tac_gia: string;
            mo_ta: string;
            gia: string;
            so_luong: string;
            anh: string;
            trang_thai: string;
            so_trang: string;
            kich_thuoc: string;
            id_shop: string;
            the_loai: any[];
        },
        thunkAPI
    ) => {
        try {
            const data = await createBook(newBook);
            return data;
        } catch (error: any) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

interface BookState {
    books: any[];
    loading: boolean;
    error: string | null;
}

const initialState: BookState = {
    books: [],
    loading: false,
    error: null,
};

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        // Nếu cần reducer sync thì viết ở đây
    },
    extraReducers: (builder) => {
        // fetchBooks
        builder.addCase(fetchBooks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            state.loading = false;
            // Tuỳ cấu trúc response, ta lưu vào state
            state.books = action.payload;
        });
        builder.addCase(fetchBooks.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });

        // addBook
        builder.addCase(addBook.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addBook.fulfilled, (state, action) => {
            state.loading = false;
            // Thêm sách mới vào mảng
            state.books.push(action.payload);
        });
        builder.addCase(addBook.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
    },
});

export default bookSlice.reducer;
