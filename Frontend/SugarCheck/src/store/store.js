import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import mealReducer from "./slices/mealSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user", "meal"], // only auth will be persisted
  timeout: 10000,
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  meal: mealReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
