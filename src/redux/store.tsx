import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoryReducer from './categorySlice.tsx';
import bookReducer from './bookSlice.tsx';

export const store = configureStore({
    reducer: {
        user: userReducer,
        categories: categoryReducer,
        books: bookReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
