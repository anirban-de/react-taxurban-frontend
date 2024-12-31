import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    report: []
};

export const SrReportSlice = createSlice({
  name: 'srreports',
  initialState,
  reducers: {
    setSrReports: (state, action) => {
      const { data } = action.payload;
      console.log(data);
      state.report = data;
    },
    clearSrReports: (state, action) => {
      state.report = null;
    }
  },
});

export const { setSrReports, clearSrReports } =
    SrReportSlice.actions;

export default SrReportSlice.reducer;
