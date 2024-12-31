import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const serviceRequestSlice = createSlice({
  name: 'service request',
  initialState,
  reducers: {
    setSRData: (state, action) => {
      const { mode, activePage, data } = action.payload;
      state[mode] = {
        ...state[mode],
        [activePage]: data,
      };
    },
    setPageCount: (state, action) => {
      const { mode, pageCount } = action.payload;
      state[mode] = {
        ...state[mode],
        pageCount: pageCount,
      };
    },
    clearSRData: (state, action) => {
      const { mode } = action.payload;
      delete state[mode];
    },
    deleteServiceRequestSlide: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSRData,
  clearSRData,
  setPageCount,
  deleteServiceRequestSlide,
} = serviceRequestSlice.actions;

export default serviceRequestSlice.reducer;
