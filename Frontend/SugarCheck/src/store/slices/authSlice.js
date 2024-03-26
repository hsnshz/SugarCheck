import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
      state.user = null;
    },
    signOut: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setToken, removeToken, signOut } = authSlice.actions;

export default authSlice.reducer;
