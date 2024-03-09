import mongoose, { model } from "mongoose";

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

const ExerciseTracking = model("ExerciseTracking", exerciseTrackingSchema);

export { ExerciseTracking };
