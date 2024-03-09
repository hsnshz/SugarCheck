import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  estimateA1c,
  predictDiabetes,
} from "../controllers/MLPredictionController.js";

router.post("/diabetes/:id", authMiddleware, predictDiabetes);
router.post("/estimate-a1c/:id", authMiddleware, estimateA1c);

export default router;
