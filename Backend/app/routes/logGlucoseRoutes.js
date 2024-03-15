import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addGlucoseLog,
  deleteGlucoseLog,
  fetchGlucoseLog,
  fetchLatestValues,
  updateGlucoseLog,
} from "../controllers/GlucoseLogController.js";

router.post("/glucose/:id", authMiddleware, addGlucoseLog);
router.get("/fetch-glucose/:id/:date", authMiddleware, fetchGlucoseLog);
router.put("/update-glucose/:id/:readingId", authMiddleware, updateGlucoseLog);
router.delete(
  "/delete-glucose/:id/:readingId",
  authMiddleware,
  deleteGlucoseLog
);
router.get("/fetch-latest-values/:id/", authMiddleware, fetchLatestValues);

export default router;
