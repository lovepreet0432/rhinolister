import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import homeReducer from './slices/homeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    home:homeReducer
  },
});

export default store;
