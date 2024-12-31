import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    report: []
};

export const InvoiceReportSlice = createSlice({
  name: 'invoicereports',
  initialState,
  reducers: {
    setInvoiceReports: (state, action) => {
      const { data } = action.payload;
      state.report = data;
    },
    clearInvoiceReports: (state, action) => {
      state.report = null;
    }
  },
});

export const { setInvoiceReports, clearInvoiceReports } =
    InvoiceReportSlice.actions;

export default InvoiceReportSlice.reducer;