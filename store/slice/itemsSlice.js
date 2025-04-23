// store/slices/itemsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: {},
  addons: [],
  variations: [],
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateAddons: (state, action) => {
      state.addons = action.payload;
    },
    updateVariations: (state, action) => {
      state.variations = action.payload;
    },
    resetItems: () => initialState,
  },
});

export const { setItems, updateAddons, updateVariations, resetItems } = itemsSlice.actions;
export default itemsSlice.reducer;
