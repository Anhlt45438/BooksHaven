// shopSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {registerShopAPI, getShopInfoAPI} from '../services/shopService'; // Import từ service gọi API để đăng ký shop và lấy thông tin shop

// Define async thunk để đăng ký shop
export const registerShop = createAsyncThunk(
  'shop/registerShop',
  async (
    shopData: {
      ten_shop: string;
      email: string;
      phoneNumber: string;
      address: string;
      province: string;
      district: string;
      ward: string;
      mo_ta: string;
    },
    thunkAPI,
  ) => {
    try {
      return await registerShopAPI(shopData); // Gọi API tạo shop
    } catch (error: any) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data.error || error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

// Define async thunk để lấy thông tin shop
export const getShopInfo = createAsyncThunk(
  'shop/getShopInfo',
  async (shop_id: string, thunkAPI) => {
    try {
      const data = await getShopInfoAPI(shop_id); // Gọi API lấy thông tin shop
      return data; // Lấy dữ liệu shop từ trường "data" trong phản hồi
    } catch (error: any) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data.error || error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

interface ShopState {
  shop: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  shop: null,
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Xử lý việc đăng ký shop
    builder.addCase(registerShop.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerShop.fulfilled, (state, action) => {
      state.loading = false;
      state.shop = action.payload; // Lưu thông tin shop vào state
    });
    builder.addCase(registerShop.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });

    // Xử lý việc lấy thông tin shop
    builder.addCase(getShopInfo.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getShopInfo.fulfilled, (state, action) => {
      console.log('Dữ liệu shop nhận về:', action.payload); // Log dữ liệu shop
      state.loading = false;
      state.shop = action.payload; // Lưu thông tin shop vào state
    });

    builder.addCase(getShopInfo.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });
  },
});

export default shopSlice.reducer;
