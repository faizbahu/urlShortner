import {configureStore} from '@reduxjs/toolkit';
import urlReducer from '../features/urls/urlSlice';
import authReducer from '../features/auth/authSlice';
export const store = configureStore({
  reducer: {
    urls: urlReducer,
    auth: authReducer,
  },
});