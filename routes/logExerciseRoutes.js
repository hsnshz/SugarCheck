import express from "express";
import {
  logExercise,
  fetchExerciseActivities,
} from "../controllers/ExerciseLogController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/log-activity/:id", authMiddleware, logExercise);
router.get(
  "/fetch-activities/:id/:date",
  authMiddleware,
  fetchExerciseActivities
);

export default router;
