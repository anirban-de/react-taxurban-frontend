import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  staffs: null,
  departments: null,
  pageCount : 0,
};

export const OfficeSlice = createSlice({
  name: 'offices',
  initialState,
  reducers: {
    setStaffs: (state, action) => {
      const { pageno, data } = action.payload;
      let temp = {};
      temp[pageno] = data;
      state.staffs = { ...state.staffs,...temp };
    },
    clearStaffs: (state) => {
      state.staffs = null;
    },
    clearPageCount : (state) => {
      state.pageCount = 0;
    },
    setPageCount: (state,action) => {
      state.pageCount = action.payload;
    },
    setDepartment: (state, action) => {
      state.departments = action.payload;
    },
    deleteOfficeSlice : () => {
      return initialState;
    }
  },
});

export const { setStaffs, setDepartment, clearStaffs, clearPageCount, setPageCount, deleteOfficeSlice } = OfficeSlice.actions;

export default OfficeSlice.reducer;
