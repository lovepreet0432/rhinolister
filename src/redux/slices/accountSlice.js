import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    shopify: 'disable',
    ebay: 'disable',
    whatnot: 'disable',
    hibid: 'disable',
    manifest: 'disable',
    seller:'',
    sellerCode:''
  },
  reducers: {
    setOption: (state, action) => {
      if(action.payload){
      const { shopify, ebay, whatnot, hibid, manifest,seller,sellerCode } = action.payload;
      state.shopify = shopify;
      state.ebay = ebay;
      state.whatnot = whatnot;
      state.hibid = hibid;
      state.manifest = manifest;
      state.seller = seller;
      state.sellerCode = sellerCode;
      }
    },
  },
});

export const { setOption } = accountSlice.actions;
export default accountSlice.reducer;
