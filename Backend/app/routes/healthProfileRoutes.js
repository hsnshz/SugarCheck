import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getHealthProfile } from "../controllers/healthProfileController.js";

router.get("/", (req, res) => {
  res.send("Hello from health profile routes!");
});
router.put("/update/:id", authMiddleware, getHealthProfile);

export default router;
