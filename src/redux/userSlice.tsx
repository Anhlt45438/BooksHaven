import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getUserInfoAccount } from '../services/authService';

export const register = createAsyncThunk(
    'user/register',
    async (
        formData: { name: string; email: string; phone: string; address: string; password: string },
        thunkAPI
    ) => {
        try {
            return await registerUser(formData);
        } catch (error: any) {
            console.error("Lỗi trong register createAsyncThunk:", error);
            const errorMsg =
                error.response && error.response.data
                    ? (error.response.data.error || error.response.data)
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async (
        credentials: { email: string; password: string },
        thunkAPI
    ) => {
        try {
            const data = await loginUser(credentials);
            return data;
        } catch (error: any) {
            let errorMsg = 'Đăng nhập không thành công. Vui lòng thử lại!';
            if (error.response && error.response.status === 400) {
                if (typeof error.response.data === 'string') {
                    const lowerCaseMsg = error.response.data.toLowerCase();
                    if (lowerCaseMsg.includes('account does not exist')) {
                        errorMsg = 'Tài khoản không tồn tại!';
                    } else if (lowerCaseMsg.includes('incorrect password')) {
                        errorMsg = 'Sai mật khẩu!';
                    }
                } else if (error.response.data && error.response.data.error) {
                    const lowerCaseMsg = error.response.data.error.toLowerCase();
                    if (lowerCaseMsg.includes('account does not exist')) {
                        errorMsg = 'Tài khoản không tồn tại!';
                    } else if (lowerCaseMsg.includes('incorrect password')) {
                        errorMsg = 'Sai mật khẩu!';
                    }
                }
            }
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

// Async thunk để lấy thông tin tài khoản theo user_id
export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (user_id: string, thunkAPI) => {
        try {
            const data = await getUserInfoAccount(user_id);
            return data; // Giả sử data có chứa accessToken cùng các thông tin khác
        } catch (error: any) {
            console.error("Lỗi trong fetchUserInfo createAsyncThunk:", error);
            const errorMsg =
                error.response && error.response.data
                    ? (error.response.data.error || error.response.data)
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
);

interface UserState {
    user: any;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        // Xử lý đăng ký
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
        // Xử lý đăng nhập
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
        // Xử lý lấy thông tin tài khoản
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.loading = false;
            // Cập nhật state.user với thông tin tài khoản lấy được, bao gồm accessToken
            state.user = action.payload;
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
