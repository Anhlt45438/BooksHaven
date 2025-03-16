// store.ts
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice.tsx';
import bookReducer from './bookSlice.tsx';
import shopReducer from './shopSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
    categories: categoryReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
