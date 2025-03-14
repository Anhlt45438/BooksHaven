import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, createCategory } from '../services/categoryService.tsx';

// Thunk lấy danh sách thể loại
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const data = await getCategories();
            return data;
        } catch (error: any) {
            // Xử lý lỗi
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

// Thunk thêm thể loại mới (nếu cần)
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (
        newCategory: { id_the_loai: string; ten_the_loai: string },
        thunkAPI
    ) => {
        try {
            const data = await createCategory(newCategory);
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

// Định nghĩa interface cho state categories
interface CategoryState {
    categories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        // Nếu cần reducer sync thì viết ở đây
    },
    extraReducers: (builder) => {
        // fetchCategories
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload; // Lưu data vào state
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });

        // addCategory
        builder.addCase(addCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addCategory.fulfilled, (state, action) => {
            state.loading = false;
            // Nếu tạo mới thành công, có thể push vào mảng categories
            state.categories.push(action.payload);
        });
        builder.addCase(addCategory.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
    },
});

export default categorySlice.reducer;
