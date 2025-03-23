import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    loginUser,
    registerUser,
    getUserInfoAccount,
    logoutUser,
    updateUserService,
} from '../services/authService';
import {removeAccessToken, storeAccessToken} from "./storageHelper.ts";

export const register = createAsyncThunk(
    'user/register',
    async (
        formData: {
            name: string;
            email: string;
            sdt: string;
            dia_chi: string;
            password: string;
        },
        thunkAPI,
    ) => {
        try {
            console.log('🔍 Dữ liệu gửi lên API:', formData);
            return await registerUser(formData);
        } catch (error: any) {
            console.error('🚨 Lỗi trong register createAsyncThunk:', error);
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    },
);

export const login = createAsyncThunk(
    'user/login',
    async (credentials: { email: string; password: string }, thunkAPI) => {
        try {
            const data = await loginUser(credentials);
            if (data.accessToken) {
                await storeAccessToken(data.accessToken);
                const { accessToken, ...userInfo } = data;
                return userInfo;
            }
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
    },
);

export const logoutUserThunk = createAsyncThunk(
    'user/logout',
    async (_, thunkAPI) => {
        try {
            const data = await logoutUser();
            await removeAccessToken();
            return data;
        } catch (error: any) {
            console.error('Lỗi trong logoutUserThunk:', error);
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    },
);

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (user_id: string, thunkAPI) => {
        try {
            const data = await getUserInfoAccount(user_id);
            console.log(data);
            
            return data;
        } catch (error: any) {
            console.error('Lỗi trong fetchUserData createAsyncThunk:', error);
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    },
);

export const updateUserThunk = createAsyncThunk(
    'user/updateUser',
    async (
        {
            userId,
            updateData,
        }: {
            userId: string;
            updateData: {
                username?: string;
                email?: string;
                sdt?: string;
                dia_chi?: string;
                avatar?: string | null;
                trang_thai?: number;
            };
        },
        thunkAPI,
    ) => {
        try {
            const result = await updateUserService(userId, updateData);
            return result;
        } catch (error: any) {
            console.error('🚨 Lỗi trong updateUserThunk:', error);
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data.error || error.response.data
                    : error.message;
            return thunkAPI.rejectWithValue(errorMsg);
        }
    },
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
        setUser(state, action) {
            state.user = action.payload; // Cập nhật user từ payload
        },
        logout(state) {
            state.user = null; // Xóa thông tin user khi đăng xuất
        },
    },
    extraReducers: builder => {
        // Xử lý đăng ký
        builder.addCase(register.pending, state => {
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
        builder.addCase(login.pending, state => {
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
        // Xử lý logout
        builder.addCase(logoutUserThunk.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(logoutUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = null;
        });
        builder.addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
        // Xử lý lấy thông tin tài khoản
        builder.addCase(fetchUserData.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(fetchUserData.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
        // Xử lý cập nhật user (PUT)
        builder.addCase(updateUserThunk.pending, state => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateUserThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(updateUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                typeof action.payload === 'string'
                    ? action.payload
                    : JSON.stringify(action.payload);
        });
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;