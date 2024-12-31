import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const AuthSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { role, name, email } = action.payload;
      return {
        ...state,
        role: role,
        name: name,
        email: email,
        transaction_id: role === 2 ? action.payload.transaction_id : null,
      };
    },
    resetAuth: () => initialState,
  },
});

export const { setAuth, resetAuth } = AuthSlice.actions;

export default AuthSlice.reducer;
