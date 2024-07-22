// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../features/customer/CustomerSlice';

export const store = configureStore({
    reducer: {
        customers: customerReducer,
    },
});
