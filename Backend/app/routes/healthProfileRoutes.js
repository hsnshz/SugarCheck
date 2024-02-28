import { Router } from "express";
const router = Router();
import { User } from "../models/model.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.get("/", (req, res) => {
  res.send("Hello from health profile routes!");
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { height, weight, bmi, dietaryRestrictions, allergies, medications } =
      req.body;

    console.log("req.user._id:", req.user.userId);
    console.log("req.params.id:", req.params.id);

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.healthProfile.height = height;
    user.healthProfile.weight = weight;
    user.healthProfile.bmi = bmi;
    user.healthProfile.dietaryRestrictions = dietaryRestrictions;
    user.healthProfile.allergies = allergies;
    user.healthProfile.medications = medications;

    await user.save();

    res
      .status(200)
      .send({ user, message: "User health profile updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
