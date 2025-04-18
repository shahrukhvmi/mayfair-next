import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './steps';

export const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});
