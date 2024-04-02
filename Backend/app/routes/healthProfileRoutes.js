import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getHealthProfile,
  addRiskScore,
} from "../controllers/healthProfileController.js";

router.put("/update/:id", authMiddleware, getHealthProfile);
router.put("/risk-score/:id", authMiddleware, addRiskScore);

export default router;
