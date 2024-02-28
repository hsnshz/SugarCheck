import express from "express";
import cors from "cors";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import MLpredictionRoutes from "./routes/MLpredictionRoutes.js";
import healthProfileRoutes from "./routes/healthProfileRoutes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import logGlucoseRoutes from "./routes/logGlucoseRoutes.js";
import emailVerificationRoutes from "./routes/emailVerificationRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pred", MLpredictionRoutes);
app.use("/api/health", healthProfileRoutes);
app.use("/api/log", logGlucoseRoutes);
app.use("/api/email", emailVerificationRoutes);

app.get("/protected-route", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
