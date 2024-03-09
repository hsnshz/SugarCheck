import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addMealLog,
  deleteMealLog,
  fetchMealLog,
  updateMealLog,
} from "../controllers/MealLogController.js";

router.post("/log-meal/:id", authMiddleware, addMealLog);
router.get("/fetch-meal/:id/:date", authMiddleware, fetchMealLog);
router.put("/update-meal/:id/:mealId", authMiddleware, updateMealLog);
router.delete("/delete-meal/:id/:mealId", authMiddleware, deleteMealLog);

export default router;
