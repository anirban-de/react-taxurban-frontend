import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    addCache: (state, action) => {
      const { uid, url, data } = action.payload;
      return {
        ...state,
        [uid]: {
          ...state[uid],
          [url]: data,
        },
      };
    },
    clearCache: (state, action) => {
      const { uid } = action.payload;
      return {
        ...state,
        [uid]: {},
      };
    },
    resetCache: () => {
      return initialState;
    },
  },
});

export const { addCache, clearCache, resetCache } = cacheSlice.actions;

export default cacheSlice.reducer;
