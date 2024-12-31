import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  branch_activation_amount: 0,
  photo: null,
};

export const AccountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setBranchActivationAmount: (state, action) => {
      state.branch_activation_amount = action.payload;
    },
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
    deleteAccountSlice: () => {
      return initialState;
    }
  },
});

export const { setBranchActivationAmount, setPhoto, deleteAccountSlice } = AccountSlice.actions;

export default AccountSlice.reducer;
