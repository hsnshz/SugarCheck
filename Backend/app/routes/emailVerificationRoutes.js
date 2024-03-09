import express from "express";
const router = express.Router();
import { verifyEmail } from "../controllers/emailVerificationController.js";

router.post("/verify-email", verifyEmail);

export default router;
