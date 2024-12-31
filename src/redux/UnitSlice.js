import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  units: null
};

export const UnitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    setUnits: (state, action) => {
      const { data } = action.payload;
      state.units = data;
    },
    clearUnits: (state) => {
      state.units = null;
    },
    deleteUnitSlice : () => {
      return initialState;
    }
  },
});

export const { setUnits, clearUnits, deleteUnitSlice } = UnitSlice.actions;

export default UnitSlice.reducer;
