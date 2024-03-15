import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mealLogs: [],
  mealFavorites: [],
};

const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    addMealLog: (state, action) => {
      const meal = action.payload;

      state.mealLogs.push({
        timestamp: meal.timestamp,
        mealName: meal.mealName,
        calories: meal.calories,
        carbohydrates: meal.carbohydrates,
        fats: meal.fats,
        proteins: meal.proteins,
        fiber: meal.fiber,
        notes: meal.notes,
        image: meal.image,
      });
    },
    updateMealLog: (state, action) => {
      const { _id, meals } = action.payload;
      const updatedMeal = meals[0];

      const mealLog = state.mealLogs.find((log) => log.id === _id);
      if (!mealLog) return;

      const meal = mealLog.meals.find((m) => m._id === updatedMeal._id);
      if (!meal) return;

      Object.assign(meal, updatedMeal);
    },
    setMealLogs: (state, action) => {
      state.mealLogs = action.payload;
    },
    addMealFavorite: (state, action) => {
      state.mealFavorites = [...state.mealFavorites, action.payload.recipeURL];
    },
    deleteMealFavorite: (state, action) => {
      state.mealFavorites = state.mealFavorites.filter(
        (url) => url !== action.payload.recipeURL
      );
    },
  },
});

export const {
  addMealLog,
  updateMealLog,
  addMealFavorite,
  deleteMealFavorite,
  setMealLogs,
} = mealSlice.actions;

export default mealSlice.reducer;
