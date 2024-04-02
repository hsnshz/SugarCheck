import { User } from "../models/UserModel.js";

export async function getHealthProfile(req, res) {
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
}

export async function addRiskScore(req, res) {
  try {
    const { riskScore } = req.body;

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

    if (user.healthProfile.riskAssessment.length > 0) {
      user.healthProfile.riskAssessment[
        user.healthProfile.riskAssessment.length - 1
      ].riskScore = riskScore;
    } else {
      return res.status(400).send({ error: "No risk assessment to update" });
    }

    await user.save();

    res.status(200).send({ user, message: "Risk score added successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
