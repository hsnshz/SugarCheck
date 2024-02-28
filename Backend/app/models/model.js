import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// ExerciseTracking Schema
const exerciseTrackingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: Date,
    activities: [
      {
        activityType: String,
        duration: Number,
        intensity: String,
      },
    ],
  },
  { collection: "ExerciseTracking" }
);

// User Schema
const userSchema = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    dob: { type: Date, default: Date.now },
    email: { type: String, default: "" },
    gender: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: "" },
    userSettings: {
      enableReminders: { type: Boolean, default: false },
      reminderTimes: { type: [String], default: [] },
    },
    healthProfile: {
      height: { type: Number, default: 0 },
      weight: { type: Number, default: 0 },
      bmi: { type: Number, default: 0 },
      dietaryRestrictions: { type: String, default: "" },
      allergies: { type: String, default: "" },
      medications: { type: String, default: "" },
      riskFactors: {
        age: { type: Number, default: 0 },
        gender: { type: String, default: "" },
        polyuria: { type: String, default: "" },
        polydipsia: { type: String, default: "" },
        suddenWeightLoss: { type: String, default: "" },
        weakness: { type: String, default: "" },
        polyphagia: { type: String, default: "" },
        genitalThrush: { type: String, default: "" },
        visualBlurring: { type: String, default: "" },
        itching: { type: String, default: "" },
        irritability: { type: String, default: "" },
        delayedHealing: { type: String, default: "" },
        partialParesis: { type: String, default: "" },
        muscleStiffness: { type: String, default: "" },
        alopecia: { type: String, default: "" },
        obesity: { type: String, default: "" },
      },
      glucoseReadings: {
        type: [{ timestamp: Date, glucoseValue: Number }],
        default: [],
      },
      A1cReadings: {
        type: [{ timestamp: Date, estimatedA1c: Number }],
        default: [],
      },
      riskAssessment: {
        type: [{ riskScore: String, predictionResult: String, date: Date }],
        default: [],
      },
    },
  },
  { collection: "User" }
);

const SALT_WORK_FACTOR = 10;

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

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

// Create models from the defined schemas
const User = model("User", userSchema);
const ExerciseTracking = model("ExerciseTracking", exerciseTrackingSchema);
const MealSuggestions = model("MealSuggestions", mealSuggestionsSchema);

export { User, ExerciseTracking, MealSuggestions };
