import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    setBranchData: (state, action) => {
      const { mode, activePage, data } = action.payload;
      state[mode] = {
        ...state[mode],
        [activePage]: data,
      }
    },
    setPageCount: (state,action) => {
      const { mode, pageCount } = action.payload;
      state[mode] = {
        ...state[mode],
        pageCount: pageCount
      }
    },
    clearBranchData: (state, action) => {
      const { mode } = action.payload;
      delete state[mode];
    },
    deleteBranchSlice : () => {
      return initialState;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setBranchData, clearBranchData, setPageCount, deleteBranchSlice } = branchSlice.actions;

export default branchSlice.reducer;
