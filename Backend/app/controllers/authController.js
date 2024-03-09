import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/emailService.js";

const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};

export async function signup(req, res) {
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

    // Check if the user already exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });

    if (existing) {
      return res.status(400).send({ error: "User already exists" });
    }

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
}

export async function signin(req, res) {
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
}
