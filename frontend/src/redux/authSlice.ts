import { createSlice } from '@reduxjs/toolkit';

import { IUser } from '../interfaces';

interface State {
  user?: IUser;
}

const initialState: State = {
  user: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
