// Updated selectedMessagesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMessages: [],
};

const selectedMessagesSlice = createSlice({
  name: "selectedMessages",
  initialState,
  reducers: {
    addSelectedMessage: (state, action) => {
      // Ensure state structure is correct
      if (!state || typeof state !== "object") {
        return initialState;
      }
      if (!Array.isArray(state.selectedMessages)) {
        state.selectedMessages = [];
      }

      const exists = state.selectedMessages.find((msg) => msg.id === action.payload.id);
      if (!exists) {
        state.selectedMessages.push(action.payload);
      }
    },
    clearSelectedMessages: (state) => {
      state.selectedMessages = [];
    },
  },
});

export const { addSelectedMessage, clearSelectedMessages } = selectedMessagesSlice.actions;

export default selectedMessagesSlice.reducer;
