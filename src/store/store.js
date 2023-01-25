
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import { uiSlice,  } from './ui/uiSlice';
import { calendarSlice } from './calendar/calendarSlice';
import { authSlice } from './auth/authSlice';

export  const store = configureStore({
    //evitar problema del serializable
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    reducer: {
        auth: authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer
    }
})