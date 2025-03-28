import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice.tsx';
import bookReducer from './bookSlice.tsx';
import shopReducer from './shopSlice';
import cartReducer from './cartSlice.tsx';

export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
    categories: categoryReducer,
    books: bookReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
