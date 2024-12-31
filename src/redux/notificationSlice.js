import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifcations: [],
  count: 0,
};

export const notificationSlice = createSlice({
  name: 'notifications reducer',
  initialState,
  reducers: {
    addNotifications: (state, action) => {
      return {
        notifcations: [...state.notifcations, ...action.payload],
        count: state.count + action.payload.length,
      };
    },
    clearNotificationCount: (state) => {
      state.count = 0;
    },
    clearNotifications: () => {
      return initialState;
    },
  },
});

export const { addNotifications, clearNotifications, clearNotificationCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
