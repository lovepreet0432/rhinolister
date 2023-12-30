import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  home: null
};
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomepage: (state, action) => {
      state.home = action.payload;
    }
  },
});

export const { setHomepage } =
  homeSlice.actions;

export default homeSlice.reducer;
