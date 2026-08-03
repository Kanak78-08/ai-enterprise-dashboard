import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import aiReducer from "./ai/aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
