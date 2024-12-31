import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  report: null,
  pageCount : 0,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setReport: (state, action) => {
      const { pageno, data } = action.payload;
      let temp = {};
      temp[pageno] = data;
      state.report = { ... state.report,...temp };
    },
    setPageCount: (state,action) => {
      state.pageCount = action.payload;
    },
    deleteWalletSlice : () => {
      return initialState;
    }
  },
});

export const { setReport, setPageCount, deleteWalletSlice } = walletSlice.actions;

export default walletSlice.reducer;
