import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateHealthProfile: (state, action) => {
      state.user.healthProfile = {
        ...state.user.healthProfile,
        ...action.payload,
        riskFactors:
          action.payload.riskFactors !== undefined
            ? action.payload.riskFactors
            : state.user.healthProfile.riskFactors,
        riskAssessment:
          action.payload.riskAssessment !== undefined
            ? action.payload.riskAssessment
            : state.user.healthProfile.riskAssessment,
      };
    },
    addGlucoseValueSlice: (state, action) => {
      state.user.healthProfile = {
        ...state.user.healthProfile,
        ...action.payload,
        glucoseReadings: [
          ...state.user.healthProfile.glucoseReadings,
          {
            glucoseValue: action.payload.glucoseValue,
            recordedTimestamp: action.payload.recordedTimestamp,
          },
        ],
      };
    },
    updateGlucoseValueSlice: (state, action) => {
      state.user.healthProfile.glucoseReadings =
        state.user.healthProfile.glucoseReadings.map((reading) =>
          reading._id === action.payload.id
            ? {
                timestamp: action.payload.timestamp,
                glucoseValue: action.payload.glucoseValue,
              }
            : reading
        );
    },
    addA1cReadingSlice: (state, action) => {
      state.user.healthProfile = {
        ...state.user.healthProfile,
        A1cReadings: [
          ...state.user.healthProfile.A1cReadings,
          {
            estimatedA1c: action.payload.estimatedA1c,
            timestamp: action.payload.timestamp,
          },
        ],
      };
    },
    removeToken: (state) => {
      state.token = null;
      state.user = null;
    },
    signOut: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const {
  setToken,
  setUser,
  updateUser,
  updateHealthProfile,
  addGlucoseValueSlice,
  updateGlucoseValueSlice,
  addA1cReadingSlice,
  removeToken,
  signOut,
} = authSlice.actions;

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // only auth will be persisted
  timeout: 10000,
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
