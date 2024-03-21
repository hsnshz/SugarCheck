import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

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
    profilePicture: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: "" },
    passwordResetCode: { type: String, default: "" },
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
        type: [
          {
            timestamp: { type: Date, default: Date.now },
            glucoseValue: { type: Number, default: 0 },
          },
        ],
        default: [],
      },
      A1cReadings: {
        type: [
          {
            timestamp: { type: Date, default: Date.now },
            estimatedA1c: { type: Number, default: 0 },
          },
        ],
        default: [],
      },
      riskAssessment: {
        type: [
          {
            riskScore: { type: String, default: "low" },
            predictionResult: { type: String, default: "negative" },
            date: { type: Date, default: Date.now },
          },
        ],
        default: [],
      },
    },
  },
  { collection: "User", timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    next();
  });
});

// Create models from the defined schemas
const User = model("User", userSchema);

export { User };
