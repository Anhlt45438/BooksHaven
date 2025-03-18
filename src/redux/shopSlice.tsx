import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getShopInfoAPI,
  createShopAPI,
  updateShopAPI, getShopInfoByShopIdAPI,
} from '../services/shopService';

// Define async thunk để lấy thông tin shop
export const getShopInfo = createAsyncThunk(
    'shop/getShopInfo',
    async (shop_id: string, thunkAPI) => {
      try {
        const data = await getShopInfoByShopIdAPI(shop_id);
        console.log('Dữ liệu từ API:', data);
        return data;
      } catch (error: any) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data.error || error.response.data
                : error.message;
        console.log('Lỗi từ API:', errorMsg);
        return thunkAPI.rejectWithValue(errorMsg);
      }
    }
);

// Define async thunk để đăng ký shop
export const registerShop = createAsyncThunk(
  'shop/registerShop',
  async (
    {shopData, accessToken}: {shopData: any; accessToken: string},
    thunkAPI,
  ) => {
    try {
      const response = await createShopAPI(shopData, accessToken);
      return response;
    } catch (error: any) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data.error || error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

// Thêm async thunk để cập nhật thông tin shop
export const updateShopInfo = createAsyncThunk(
  'shop/updateShopInfo',
  async (
    {
      shopData,
      shopId,
      accessToken,
    }: {shopData: any; shopId: string; accessToken: string},
    thunkAPI,
  ) => {
    try {
      const response = await updateShopAPI(shopData, shopId, accessToken);
      return response;
    } catch (error: any) {
      const errorMsg =
        error.response && error.response.data
          ? error.response.data.error || error.response.data
          : error.message;
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

// Async thunk để lấy thông tin shop bằng shop_id
export const getShopInfoById = createAsyncThunk(
    'shop/getShopInfoById',
    async (shop_id: string, thunkAPI) => {
      try {
        const data = await getShopInfoByShopIdAPI(shop_id);
        return data;
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
    builder.addCase(getShopInfo.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getShopInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.shop = action.payload;
    });
    builder.addCase(getShopInfo.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });

    builder.addCase(registerShop.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerShop.fulfilled, (state, action) => {
      state.loading = false;
      state.shop = action.payload;
    });
    builder.addCase(registerShop.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });
    builder.addCase(updateShopInfo.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateShopInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.shop = action.payload; // Cập nhật lại shop sau khi sửa
    });
    builder.addCase(updateShopInfo.rejected, (state, action) => {
      state.loading = false;
      state.error =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });
    // Xử lý cho getShopInfoById
    builder.addCase(getShopInfoById.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getShopInfoById.fulfilled, (state, action) => {
      state.loading = false;
      state.shop = action.payload;
    });
    builder.addCase(getShopInfoById.rejected, (state, action) => {
      state.loading = false;
      state.error =
          typeof action.payload === 'string'
              ? action.payload
              : JSON.stringify(action.payload);
    });
  },
});

export default shopSlice.reducer;
