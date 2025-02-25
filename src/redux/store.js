// store.js
import { createStore, combineReducers } from 'redux';
import authReducer from './authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    // Các reducer khác nếu có...
});

const store = createStore(rootReducer);

export default store;
