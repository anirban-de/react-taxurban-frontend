import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  branch_activation_amount : 0
};

export const SettingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action) => {
      const { branch_activation_amount } = action.payload;
      state.branch_activation_amount = branch_activation_amount;
    },
    deleteSettingsSlide: () => {
      return initialState;
    }
  },
});

export const { setSettings, deleteSettingsSlide } = SettingSlice.actions;

export default SettingSlice.reducer;
