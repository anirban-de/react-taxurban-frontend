import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: null,
  pageCount: 0,
};

export const CustomerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      const { pageno, data } = action.payload;
      let temp = {};
      temp[pageno] = data;
      state.customers = { ...state.customers, ...temp };
    },
    clearCustomer: (state) => {
      state.customers = null;
    },
    setPageCount: (state, action) => {
      state.pageCount = action.payload;
    },
    deleteCustomer: () => {
      return initialState;
    },
    RESET: (state, action) => initialState, // Replace initialState with your slice's initial state
  },
});

export const { setCustomers, clearCustomer, setPageCount, deleteCustomer } =
  CustomerSlice.actions;

export default CustomerSlice.reducer;
