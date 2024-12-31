import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: null,
  pageCount : 0,
};

export const ClientIDSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      const { id, pageno, data } = action.payload;
      let temp = {};
      temp[id] = {
        [pageno] : data
      };
      state.clients = { ...state.clients,...temp };
    },
    clearClients: (state) => {
      state.clients = null;
    },
    setPageCount: (state,action) => {
      state.pageCount = action.payload;
    },
    deleteClientSlice : () => {
      return initialState;
    }
  },
});

export const { setClients, clearClients, setPageCount, deleteClientSlice } = ClientIDSlice.actions;

export default ClientIDSlice.reducer;
