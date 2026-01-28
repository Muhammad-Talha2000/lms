import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedinUser: null,
    signupData: null,
  },
  reducers: {
    setLoggedinUser: (state, action) => {
      state.loggedinUser = action.payload;
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
  },
});

export const { setLoggedinUser, setSignupData } = authSlice.actions;
export default authSlice.reducer;
