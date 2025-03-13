// store.ts
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import shopReducer from './shopSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    shop: shopReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
