// store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import stepReducer from "./steps"; // Your step slice
import { questionsApi } from "./questionsApi";
import { dashboardApi } from "@/store/dashboardApi";
import { productVariationApi } from "./productVariationApi";
import cartReducer from "./slice/cartSlice";
import addonCartReducer from "./slice/addonCartSlice";
import selectedMessagesReducer from "./slice/selectedMessagesSlice";
import itemsReducer from "./slice/itemsSlice";

// Combine all reducers
const rootReducer = combineReducers({
  steps: stepReducer, // Form steps
  cart: cartReducer,
  addonCart: addonCartReducer,
  selectedMessages: selectedMessagesReducer,
  items: itemsReducer,
  [questionsApi.reducerPath]: questionsApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [productVariationApi.reducerPath]: productVariationApi.reducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Wrap root reducer with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer + RTK Query middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }).concat(questionsApi.middleware, dashboardApi.middleware, productVariationApi.middleware), // Add RTK middleware
});

// Create persistor for redux-persist
export const persistor = persistStore(store);
