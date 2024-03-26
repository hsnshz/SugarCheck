import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addMealLog,
  deleteMealLog,
  fetchLoggedMeals,
  fetchMealLog,
  updateMealLog,
} from "../controllers/MealLogController.js";

router.post("/log-meal/:id", authMiddleware, addMealLog);
router.get("/fetch-all-meals/:id/", authMiddleware, fetchLoggedMeals);
router.get("/fetch-meal/:id/:date/:mode", authMiddleware, fetchMealLog);
router.put(
  "/update-meal/:id/:mealLogId/:mealId",
  authMiddleware,
  updateMealLog
);
router.delete(
  "/delete-meal/:id/:mealLogId/:mealId",
  authMiddleware,
  deleteMealLog
);

export default router;
