import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

// ExerciseTracking Schema
const exerciseLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    date: Date,
    activities: [
      {
        activityType: { type: String, default: "" },
        duration: { type: Number, default: 0, min: 0 },
        intensity: {
          type: String,
          default: "",
          enum: ["Low", "Moderate", "High"],
        },
        caloriesBurned: { type: Number, default: 0, min: 0 },
        notes: { type: String, default: "" },
      },
    ],
  },
  { collection: "ExerciseLog", timestamps: true }
);

const ExerciseLog = model("ExerciseLog", exerciseLogSchema);

export { ExerciseLog };
