import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  updateProfile,
  requestPasswordReset,
  resetPassword,
  deleteAccount,
  changePassword,
  deleteProfilePicture,
} from "../controllers/profileController.js";
import multer from "multer";
import path from "path";

const upload = multer({ dest: "uploads/" });

router.put(
  "/update/:id",
  authMiddleware,
  upload.single("photo"),
  updateProfile
);
router.delete(
  "/delete-profile-picture/:id",
  authMiddleware,
  deleteProfilePicture
);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.put("/change-password/:id", authMiddleware, changePassword);
router.delete("/delete-account/:id", authMiddleware, deleteAccount);

export default router;
