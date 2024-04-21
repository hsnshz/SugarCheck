import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    dob: null,
    email: "",
    gender: "",
    phoneNumber: "",
    profilePicture: "",
    isEmailVerified: false,
    emailVerificationCode: "",
    passwordResetCode: "",
    userSettings: {
      glucoseReminders: {
        enabled: false,
        times: [""],
      },
      mealReminders: {
        enabled: false,
        times: [""],
      },
      exerciseNotificationTime: {
        enabled: false,
        time: "",
      },
    },
    healthProfile: {
      height: 0,
      weight: 0,
      bmi: 0,
      dietaryRestrictions: "",
      allergies: "",
      medications: "",
      riskFactors: {
        age: 0,
        gender: "",
        polyuria: "",
        polydipsia: "",
        suddenWeightLoss: "",
        weakness: "",
        polyphagia: "",
        genitalThrush: "",
        visualBlurring: "",
        itching: "",
        irritability: "",
        delayedHealing: "",
        partialParesis: "",
        muscleStiffness: "",
        alopecia: "",
        obesity: "",
      },
      glucoseReadings: [],
      A1cReadings: [],
      riskAssessment: [],
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
    updateUserSettings: (state, action) => {
      state.user.userSettings = {
        ...state.user.userSettings,
        ...action.payload,
      };
    },
    addGlucoseValueSlice: (state, action) => {
      state.user.healthProfile.glucoseReadings.push({
        glucoseValue: action.payload.glucoseValue,
        recordedTimestamp: action.payload.recordedTimestamp,
        id: action.payload.id,
      });
    },
    updateGlucoseValueSlice: (state, action) => {
      state.user.healthProfile.glucoseReadings =
        state.user.healthProfile.glucoseReadings.map((reading) =>
          reading.id === action.payload.id
            ? {
                timestamp: action.payload.timestamp,
                glucoseValue: action.payload.glucoseValue,
                id: action.payload.id,
              }
            : reading
        );
    },
    deleteGlucoseValueSlice: (state, action) => {
      const updatedReadings = state.user.healthProfile.glucoseReadings.filter(
        (reading) => {
          return reading.id !== action.payload.id;
        }
      );

      state.user.healthProfile.glucoseReadings = updatedReadings;
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
  },
});

export const {
  setUser,
  updateUser,
  updateHealthProfile,
  updateUserSettings,
  addGlucoseValueSlice,
  updateGlucoseValueSlice,
  deleteGlucoseValueSlice,
  addA1cReadingSlice,
} = userSlice.actions;

export default userSlice.reducer;
