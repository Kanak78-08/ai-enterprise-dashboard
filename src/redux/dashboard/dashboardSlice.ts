import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DashboardState {
  kpis: any[];
  notifications: any[];
  activities: any[];
}

const initialState: DashboardState = {
  kpis: [],
  notifications: [],
  activities: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (
      state,
      action: PayloadAction<Partial<DashboardState>>
    ) => {
      return { ...state, ...action.payload };
    },
    clearDashboardData: () => initialState,
  },
});

export const { setDashboardData, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
