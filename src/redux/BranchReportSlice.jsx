import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    report: []
};

export const BranchReportSlice = createSlice({
  name: 'branchreports',
  initialState,
  reducers: {
    setBranchReports: (state, action) => {
      const { data } = action.payload;
      state.report = data;
    },
    clearBranchReports: (state, action) => {
      state.report = null;
    }
  },
});

export const { setBranchReports, clearBranchReports } =
    BranchReportSlice.actions;

export default BranchReportSlice.reducer;