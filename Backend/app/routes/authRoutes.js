import { Router } from "express";
const router = Router();
import { User } from "../models/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendVerificationEmail } from "../utils/emailService.js";

router.get("/", (req, res) => {
  res.send("Hello from authRoutes!");
});

const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};

router.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      dob,
      email,
      gender,
      phoneNumber,
    } = req.body;

    const user = new User({
      firstName,
      lastName,
      username,
      password,
      dob,
      email,
      gender,
      phoneNumber,
      isEmailVerified: false,
    });

    const code = generateVerificationCode();
    user.emailVerificationCode = code;

    await user.save();

    await sendVerificationEmail(email, code);

    // Create a token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the token and user data
    res.status(201).send({ token, user, message: "User created successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by their username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(401)
        .json({ error: "Please verify your email before signing in" });
    }

    // Compare the submitted password to the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // User is authenticated, create a session or token
    if (isMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send back a response with the token and user data
      return res.json({ token, user, message: "User signed in successfully" });
    }

    // Send back a response
    res.json({ message: "User signed in successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;

    console.log("req.user._id:", req.user._id.toString());
    console.log("req.params.id:", req.params.id);

    // Check if the authenticated user is the same as the user to be updated
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).send({ user, message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
