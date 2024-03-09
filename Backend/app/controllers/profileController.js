import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};
export async function updateProfile(req, res) {
  try {
    const { username, email, phoneNumber } = req.body;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    // If a file was uploaded, update the user's profile picture
    if (req.file) {
      console.log("req.file:", req.file);
      user.profilePicture = req.file.path;
    }

    await user.save();

    res.status(200).send({ user, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function deleteProfilePicture(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.profilePicture = "";
    await user.save();

    res.status(200).send({ message: "Profile picture deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const verificationCode = generateVerificationCode();
    user.passwordResetCode = verificationCode;

    await user.save();
    await sendPasswordResetEmail(email, verificationCode);

    res.status(200).send({ message: "Password reset email sent." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.passwordResetCode !== code) {
      return res.status(400).send({ error: "Invalid reset code" });
    }

    user.password = newPassword;
    user.passwordResetCode = null;

    await user.save();

    res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    console.log("req.user.userId:", req.user.userId);
    console.log("req.params.id:", req.params.id);

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function deleteAccount(req, res) {
  try {
    console.log("req.user.userId:", req.user.userId);
    console.log("req.params.id:", req.params.id);

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    await user.deleteOne({ _id: req.params.id });

    res.status(200).send({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
