import { Router } from "express";
const router = Router();
import { User } from "../models/model.js";
import axios from "axios";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const FLASK_API = process.env.FLASK_URL;

router.get("/", (req, res) => {
  res.send("Hello from Diabetes Form Data Routes!");
});

router.post("/diabetes/:id", authMiddleware, async (req, res) => {
  try {
    let formData = req.body;

    let formattedFormData = {};

    for (let key in formData) {
      let newKey = key
        .split(" ")
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");

      formattedFormData[newKey] = formData[key];
    }

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const flask_api = `${FLASK_API}/predict`;
    const response = await axios.post(flask_api, formData);

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.healthProfile.riskFactors = formattedFormData;
    user.healthProfile.riskAssessment.push({
      predictionResult:
        response.data[0] === 1
          ? "Likely to be diabetic"
          : "Unlikely to be diabetic",
      date: new Date(),
    });

    await user.save();

    res.status(200).send({
      predictionResult: response.data[0] === 1 ? "likely" : "unlikely",
      formattedFormData,
      message: "User risk factors and assessment updated successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
});

router.post("/estimate-a1c/:id", authMiddleware, async (req, res) => {
  try {
    let data = req.body;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    console.log("Data: ", data);

    const flask_api = `${FLASK_API}/estimate-a1c`;
    const response = await axios.post(flask_api, data);

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const A1cValue = parseFloat(response.data[0].toFixed(2));
    console.log("A1c Value Response: ", A1cValue);

    user.healthProfile.A1cReadings.push({
      estimatedA1c: A1cValue,
      timestamp: new Date(),
    });

    await user.save();

    res.status(200).send({
      A1cValue,
      message: "A1c value updated successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
});

export default router;
