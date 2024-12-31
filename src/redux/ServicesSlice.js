import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  services: null,
  categories: null,
  pageCount: 0,
};

export const ServicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action) => {
      const { pageno, data } = action.payload;
      let temp = {};
      temp[pageno] = data;
      state.services = { ...state.services,...temp };
    },
    clearServices: (state, action) => {
      state.services = null;
    },
    clearPageCount: (state, action) => {
      state.pageCount = 0;
    },
    setServicesCategories: (state, action) => {
      state.categories = action.payload;
    },
    setPageCount: (state,action) => {
      state.pageCount = action.payload;
    },
    clearServicesCategories: (state) => {
      state.categories = null;
    },
    deleteServicesSlice: () => {
      return initialState;
    }
  },
});

export const { setServices, clearServices, clearPageCount, setServicesCategories, setPageCount, clearServicesCategories, deleteServicesSlice } =
  ServicesSlice.actions;

export default ServicesSlice.reducer;
