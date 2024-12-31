import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    packages: []
};

export const gstSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setPackages: (state, action) => {
      const data  = action.payload;
      let temp = {};
      state.packages = data;
    },
    clearPackage: (state) => {
      state.packages = null;
    },
    deletePackage: () => {
      return initialState;
    },
    RESET: (state, action) => initialState, // Replace initialState with your slice's initial state
  },
});

export const { setPackages, clearPackage, deletePackage } =
  gstSlice.actions;

export default gstSlice.reducer;