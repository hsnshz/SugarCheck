import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

// MealSuggestions Schema
const mealSuggestionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    preferences: {
      dietType: String,
      allergies: [String],
      dislikedFoods: [String],
    },
  },
  { collection: "MealSuggestions" }
);

// Meal Favorites Schema
const mealFavoritesSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    recipeURL: { type: String, default: "" },
  },
  { collection: "MealFavorites" }
);

// Meal Logging Schema
const mealLoggingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    meals: [
      {
        timestamp: { type: Date, default: Date.now },
        mealName: { type: String, default: "" },
        calories: { type: Number, default: 0 },
        carbohydrates: { type: Number, default: 0 },
        fats: { type: Number, default: 0 },
        proteins: { type: Number, default: 0 },
        notes: { type: String, default: "" },
      },
    ],
  },
  { collection: "MealLogs" }
);

const MealSuggestions = model("MealSuggestions", mealSuggestionsSchema);
const MealFavorites = model("MealFavorites", mealFavoritesSchema);
const MealLogs = model("MealLogs", mealLoggingSchema);

export { MealSuggestions, MealFavorites, MealLogs };
