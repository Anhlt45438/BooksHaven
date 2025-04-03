import {createSlice, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {getBooks, createBook, getHotBooks} from '../services/bookService';

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

export const fetchHotBooks = createAsyncThunk(
    'books/fetchHotBooks',
    async (limit: number = 5, thunkAPI) => {
        try {
            const data = await getHotBooks(limit);
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
            da_ban: number;
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
    hotBooks: any[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
}

const initialState: BookState = {
    books: [],
    hotBooks: [],
    loading: false,
    error: null,
    hasMore: true,
};

export const resetBooks = createAction('books/reset');
const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        // Nếu cần reset danh sách sách
        resetBooks: (state) => {
            state.books = [];
            state.hotBooks = [];
            state.hasMore = true;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchBooks
        builder.addCase(fetchBooks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            state.loading = false;
            const newBooks = action.payload.data || action.payload;
            if (action.meta.arg.page === 1) {
                state.books = newBooks; // Thay thế hoàn toàn nếu là trang 1
            } else {
                state.books = [...state.books, ...newBooks]; // Nối thêm nếu là trang tiếp theo
            }
            state.hasMore = newBooks.length >= 20;
        });
        builder.addCase(fetchBooks.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });

        // fetchHotBooks
        builder.addCase(fetchHotBooks.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchHotBooks.fulfilled, (state, action) => {
            state.loading = false;
            state.hotBooks = action.payload.data || action.payload; // Lưu danh sách sách hot
        });
        builder.addCase(fetchHotBooks.rejected, (state, action) => {
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
