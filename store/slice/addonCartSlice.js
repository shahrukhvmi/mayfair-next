import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  addonCart: [],
};

// Create Slice
const addonCartSlice = createSlice({
  name: "addonCart",
  initialState,
  reducers: {
    // Add to Cart
    addToCartAddon(state, action) {
      const newItem = action.payload;
      const qty = Number(newItem.qty) || 1;

      if (Array.isArray(state.addonCart)) {
        const existingItem = state.addonCart.find((item) => item.id === newItem.id);

        if (existingItem) {
          existingItem.qty = qty;
        } else {
          state.addonCart.push({ ...newItem, qty });
        }
      }
    },

    // Remove from Cart
    removeFromCartAddon(state, action) {
      if (Array.isArray(state.addonCart)) {
        state.addonCart = state.addonCart.filter((item) => item.id !== action.payload);
      }
    },

    // Update Item in Cart
    updateCartAddon(state, action) {
      const updatedItem = action.payload;

      if (Array.isArray(state.addonCart)) {
        const index = state.addonCart.findIndex((item) => item.id === updatedItem.id);

        if (index !== -1) {
          if (updatedItem.qty > 0) {
            state.addonCart[index] = updatedItem;
          } else {
            state.addonCart.splice(index, 1);
          }
        }
      }
    },

    // Clear Entire Cart
    clearCartAddon(state) {
      state.addonCart = [];
    },
  },
});

// Export Actions
export const { addToCartAddon, removeFromCartAddon, updateCartAddon, clearCartAddon } = addonCartSlice.actions;

// Export Reducer
export default addonCartSlice.reducer;
