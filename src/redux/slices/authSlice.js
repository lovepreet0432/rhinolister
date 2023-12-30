import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userProfile: {
    first_name: "",
    last_name: "",
    company:null,
    street_one:'',
    street_two:null,
    city: "",
    zipcode: "",
    state:"",
    country:"US",
    image: null,
  },
  userSubscription:{},
  token: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setUserSubscription :(state,action)=>{
      state.userSubscription = action.payload; 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout, setIsAuthenticated, setUserProfile,setUserSubscription } =
  authSlice.actions;

export default authSlice.reducer;
