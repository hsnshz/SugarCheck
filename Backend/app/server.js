import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import MLpredictionRoutes from "./routes/MLpredictionRoutes.js";
import healthProfileRoutes from "./routes/healthProfileRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import logGlucoseRoutes from "./routes/logGlucoseRoutes.js";
import emailVerificationRoutes from "./routes/emailVerificationRoutes.js";
import dietRecipeRoutes from "./routes/dietRecipeRoutes.js";
import logMealsRoutes from "./routes/logMealsRoutes.js";
import logExerciseRoutes from "./routes/logExerciseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import generateReportRoutes from "./routes/generateReportRoutes.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  fs.readFileSync(
    new URL(
      "../../../sugarcheck-0-firebase-adminsdk-sirmc-444be3e09d.json",
      import.meta.url
    ),
    "utf-8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://sugarcheck-0.appspot.com",
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/pred", MLpredictionRoutes);
app.use("/api/health", healthProfileRoutes);
app.use("/api/log", logGlucoseRoutes);
app.use("/api/email", emailVerificationRoutes);
app.use("/api/diet", dietRecipeRoutes);
app.use("/api/meals", logMealsRoutes);
app.use("/api/exercise", logExerciseRoutes);
app.use("/api/report", generateReportRoutes);

app.get("/protected-route", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
