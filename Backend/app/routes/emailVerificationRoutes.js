import express from "express";
const router = express.Router();
import { User } from "../models/model.js";

router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  if (user.emailVerificationCode !== code) {
    return res.status(400).send({ error: "Invalid verification code" });
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = null;

  await user.save();

  res.send({ message: "Email verified successfully" });
});

export default router;
