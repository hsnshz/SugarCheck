import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateReport } from "../controllers/ReportGenerationController.js";

router.post("/generate/:id", authMiddleware, generateReport);

export default router;
